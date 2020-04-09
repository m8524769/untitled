#include <untitled.hpp>

[[eosio::action]]
void untitled::createfile(name owner, string cid, string description, asset price) {
  require_auth( owner );

  files_table files(get_self(), get_self().value);

  bool existing = false;
  for (auto file_itr = files.begin(); file_itr != files.end() && existing != true; ++file_itr) {
    if (file_itr->cid == cid) {
      existing = true;
    }
  }
  check(existing == false, "This file is already existing");

  files.emplace(owner, [&](auto &file) {
    file.id = files.available_primary_key();
    file.owner = owner;
    file.cid = cid;
    file.description = description;
    file.for_sale = true;
    file.price = price;
  });
}

[[eosio::action]]
void untitled::sellfile(uint64_t id, asset price) {
  files_table files(get_self(), get_self().value);

  auto file_itr = files.find(id);
  check(file_itr != files.end(), "File does not exist");

  require_auth( file_itr->owner );

  files.modify(file_itr, file_itr->owner, [&](auto &file) {
    file.for_sale = true;
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

[[eosio::on_notify("eosio.token::transfer")]]
void untitled::on_transfer(name from, name to, asset quantity, string memo) {
  if (memo == "income")
    return;

  check(memo != "", "You should fill in the file ID in memo");

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
