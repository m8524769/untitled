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
void untitled::clearfile() {
  require_auth( get_self() );

  files_table files(get_self(), get_self().value);

  auto file_itr = files.begin();
  while (file_itr != files.end()) {
    file_itr = files.erase(file_itr);
  }
}

[[eosio::on_notify("eosio.token::transfer")]]
void untitled::on_transfer(name from, name to, asset quantity, string memo) {
  files_table files(get_self(), get_self().value);

  // Find file by memo (convert string to uint64_t)
  auto file_itr = files.find(stoull(memo));
  check(file_itr != files.end(), "File does not exist");

  check(file_itr->for_sale == true, "This file is not for sale");
  check(to == file_itr->owner, "Illegal file transaction");
  check(quantity.symbol == file_itr->price.symbol, "Illegal asset symbol");
  check(quantity.amount >= file_itr->price.amount, "Insufficient amount");

  files.modify(file_itr, from, [&](auto &file) {
    file.owner = from;
    file.for_sale = false;
  });
}
