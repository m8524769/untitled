#include <untitled.hpp>

[[eosio::action]]
void untitled::createfile(name owner, checksum256 cid_hash, string encrypted_cid, string description, uint64_t size, asset price) {
  require_auth( owner );

  files_table files(get_self(), get_self().value);

  // Check if cid_hash is unique
  auto files_by_cid_hash = files.get_index<"bycidhash"_n>();
  auto file_itr = files_by_cid_hash.find(cid_hash);
  check(file_itr == files_by_cid_hash.end(), "This file is already existing");

  files.emplace(owner, [&](auto &file) {
    file.id = files.available_primary_key();
    file.owner = owner;
    file.cid_hash = cid_hash;
    file.encrypted_cid = encrypted_cid;
    file.description = description;
    file.size = size;
    file.for_sale = true;
    file.price = price;
  });
}

[[eosio::action]]
void untitled::sellfile(uint64_t file_id, string encrypted_cid, asset price) {
  check(encrypted_cid != "", "Encrypted CID is required");

  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(file_id);
  check(file_itr != files.end(), "File does not exist");

  require_auth( file_itr->owner );

  files.modify(file_itr, file_itr->owner, [&](auto &file) {
    file.encrypted_cid = encrypted_cid;
    file.for_sale = true;
    file.price = price;
  });
}

[[eosio::action]]
void untitled::modifyfile(uint64_t file_id, string description, asset price) {
  check(price.is_valid(), "Invalid price");

  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(file_id);
  check(file_itr != files.end(), "File does not exist");

  require_auth( file_itr->owner );

  files.modify(file_itr, file_itr->owner, [&](auto &file) {
    file.description = description;
    file.price = price;
  });
}

[[eosio::action]]
void untitled::placeorder(name buyer, uint64_t file_id) {
  require_auth( buyer );

  orders_table orders(get_self(), get_self().value);

  auto order_itr = orders.find(file_id);
  if (order_itr != orders.end()) {
    check(buyer != order_itr->buyer, "You have already placed this order");
    check(now() - order_itr->create_time > order_security_period, "You are late, dude");
    order_itr = orders.erase(order_itr);
  }

  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(file_id);
  check(file_itr != files.end(), "File does not exist");

  check(buyer != file_itr->owner, "This file is already yours");
  check(file_itr->for_sale == true, "This file is not for sale");

  orders.emplace(buyer, [&](auto &order) {
    order.file_id = file_id;
    order.buyer = buyer;
    order.price = file_itr->price;
    order.create_time = now();
  });
}

[[eosio::action]]
void untitled::cancelorder(uint64_t file_id) {
  orders_table orders(get_self(), get_self().value);

  auto order_itr = orders.find(file_id);
  check(order_itr != orders.end(), "Order does not exist");

  require_auth( order_itr->buyer );

  order_itr = orders.erase(order_itr);
}

[[eosio::action]]
void untitled::addwish(name account, uint64_t file_id) {
  require_auth( account );

  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(file_id);
  check(file_itr != files.end(), "File does not exist");
  check(account != file_itr->owner, "You have already owned this file");

  wishlist_table wishlist(get_self(), account.value);

  auto wish_itr = wishlist.find(file_id);
  if (wish_itr == wishlist.end()) {
    wishlist.emplace(account, [&](auto &wish) {
      wish.file_id = file_id;
      wish.description = file_itr->description;
    });
  } else {
    wishlist.modify(wish_itr, account, [&](auto &wish) {
      wish.description = file_itr->description;
    });
  }
}

[[eosio::action]]
void untitled::removewish(name account, uint64_t file_id) {
  require_auth( account );

  wishlist_table wishlist(get_self(), account.value);

  auto wish_itr = wishlist.find(file_id);
  check(wish_itr != wishlist.end(), "This file does not exist on your wishlist");

  wish_itr = wishlist.erase(wish_itr);
}

[[eosio::action]]
void untitled::updatecid(uint64_t file_id, string encrypted_cid) {
  require_auth( get_self() );

  check(encrypted_cid != "", "Encrypted CID is required");

  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(file_id);
  check(file_itr != files.end(), "File does not exist");

  files.modify(file_itr, get_self(), [&](auto &file) {
    file.encrypted_cid = encrypted_cid;
  });
}

[[eosio::action]]
void untitled::discontinue(uint64_t file_id) {
  require_auth( get_self() );

  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(file_id);
  check(file_itr != files.end(), "File does not exist");

  files.modify(file_itr, get_self(), [&](auto &file) {
    file.for_sale = false;
  });
}

[[eosio::action]]
void untitled::clearfiles() {
  require_auth( get_self() );

  files_table files(get_self(), get_self().value);

  auto file_itr = files.begin();
  while (file_itr != files.end()) {
    file_itr = files.erase(file_itr);
  }
}

[[eosio::action]]
void untitled::clearorders() {
  require_auth( get_self() );

  orders_table orders(get_self(), get_self().value);

  auto order_itr = orders.begin();
  while (order_itr != orders.end()) {
    order_itr = orders.erase(order_itr);
  }
}

[[eosio::action]]
void untitled::setkey(name account, string rsa_public_key) {
  require_auth( account );

  check(rsa_public_key != "", "RSA public key is required");

  rsa_keys_table keys(get_self(), account.value);

  if (keys.begin() == keys.end()) {
    keys.emplace(account, [&](auto &key) {
      key.public_key = rsa_public_key;
    });
  } else {
    keys.modify(keys.begin(), account, [&](auto &key) {
      key.public_key = rsa_public_key;
    });
  }
}

[[eosio::on_notify("eosio.token::transfer")]]
void untitled::on_transfer(name from, name to, asset quantity, string memo) {
  if (memo == "exchange" || memo == "income")
    return;

  // Token Exchange (if memo is empty)
  if (memo == "") {
    asset equivalent;

    auto sym = quantity.symbol;
    if (sym.code() == symbol_code("EOS")) {
      equivalent = asset(quantity.amount * exchange_rate, default_symbol);
    } else if (sym.code() == default_symbol.code()) {
      equivalent = asset(quantity.amount / exchange_rate, symbol(symbol_code("EOS"), 4));
    }
    check(equivalent.is_valid(), "Illegal exchange");

    // Send back the equivalent tokens
    action(
      permission_level{get_self(), "active"_n},
      "eosio.token"_n,
      "transfer"_n,
      make_tuple(get_self(), from, equivalent, string("exchange"))
    ).send();

    return;
  }

  files_table files(get_self(), get_self().value);

  // Find file by memo (convert string to uint64_t)
  auto file_itr = files.find(stoull(memo));
  check(file_itr != files.end(), "File does not exist");

  check(from != file_itr->owner, "This file is already yours");
  check(file_itr->for_sale == true, "This file is not for sale");

  // Check Order
  orders_table orders(get_self(), get_self().value);

  auto order_itr = orders.find(file_itr->id);
  if (order_itr != orders.end()) {
    check(from == order_itr->buyer, "This file has been ordered by others");
    // Pay at Order price
    check(quantity.symbol == order_itr->price.symbol, "Illegal asset symbol");
    check(quantity.amount >= order_itr->price.amount, "Insufficient amount");
    // Legal Transaction, remove order
    order_itr = orders.erase(order_itr);
  } else {
    // Pay at Current price
    check(quantity.symbol == file_itr->price.symbol, "Illegal asset symbol");
    check(quantity.amount >= file_itr->price.amount, "Insufficient amount");
  }

  // Need `eosio.code` permission to run inline actions, command:
  // cleos set account permission <CONTRACT_ACCOUNT> active --add-code
  action(
    permission_level{get_self(), "active"_n},
    "eosio.token"_n,
    "transfer"_n,
    make_tuple(get_self(), file_itr->owner, quantity, string("income"))
  ).send();

  files.modify(file_itr, get_self(), [&](auto &file) {
    file.owner = from;
    file.for_sale = false;
  });
}
