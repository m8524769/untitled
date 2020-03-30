#include <untitled.hpp>

ACTION untitled::hi(name from, string message) {
  require_auth(from);

  // Init the _message table
  messages_table _messages(get_self(), get_self().value);

  // Find the record from _messages table
  auto msg_itr = _messages.find(from.value);
  if (msg_itr == _messages.end()) {
    // Create a message record if it does not exist
    _messages.emplace(from, [&](auto& msg) {
      msg.user = from;
      msg.text = message;
    });
  } else {
    // Modify a message record if it exists
    _messages.modify(msg_itr, from, [&](auto& msg) {
      msg.text = message;
    });
  }
}

ACTION untitled::clear() {
  require_auth(get_self());

  messages_table _messages(get_self(), get_self().value);

  // Delete all records in _messages table
  auto msg_itr = _messages.begin();
  while (msg_itr != _messages.end()) {
    msg_itr = _messages.erase(msg_itr);
  }
}

ACTION untitled::inituser(name user, string info) {
  require_auth( user );

  users_table users(get_self(), get_self().value);

  auto user_itr = users.find(user.value);
  if (user_itr == users.end()) {
    users.emplace(user, [&](auto& row) {
      row.user = user;
      row.info = info;
      row.balance = asset(0, symbol("ASS", 4));
    });
  } else {
    users.modify(user_itr, user, [&](auto& row) {
      row.info = info;
    });
  }
}

ACTION untitled::clearuser() {
  require_auth(get_self());
  users_table users(get_self(), get_self().value);
  auto user_itr = users.begin();
  while (user_itr != users.end()) {
    user_itr = users.erase(user_itr);
  }
}

[[eosio::action]]
void untitled::createfile(uint64_t id, string filename, string description, asset price) {
  require_auth( get_self() );

  files_table files(get_self(), get_self().value);
  files.emplace(get_self(), [&](auto& row) {
    row.id = id;
    row.owner = get_self();
    row.filename = filename;
    row.description = description;
    row.price = price;
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

[[eosio::action]]
void untitled::buyfile(name buyer, uint64_t id) {
  // require_auth( buyer );

  files_table files(get_self(), get_self().value);
  auto file_itr = files.find(id);
  check( file_itr != files.end(), "no such file" );

  const auto& file = *file_itr;
  // check( get_self().balance >= *file.price, "insufficient balance" );

  // token::transfer_action transfer("token"_n, {get_self(), "active"_n});
  // transfer.send(get_self(), file.owner, file.price, "");

  action{
    permission_level{get_self(), "active"_n},
    "eosio.token"_n,
    "transfer"_n,
    std::make_tuple(get_self(), file.owner, file.price, "")
  }.send();
}

// EOSIO_DISPATCH(untitled, (hi)(clear)(clearuser)(inituser)(buyfile))

// void untitled::on_transfer(name from, name to, asset quantity, string memo) {
//   // Validate transaction participants and escape
//   if (from != get_self() || to == get_self()) return;
//   // Define token symbol
//   symbol token_symbol("ASS", 4);
//   // Validate contract state and arguments
//   check(quantity.amount > 0, "Insufficient value");
//   check(quantity.symbol == token_symbol, "Illegal asset symbol");
//   // Find the members wallet
//   users_table users(get_self(), get_self().value);

//   auto from_itr = users.find(from.value);
//   if (from_itr != users.end()) {
//     users.modify(from_itr, get_self(), [&](auto &row) {
//       row.balance += quantity;
//     });
//   } else {
//     users.emplace(get_self(), [&](auto &row) {
//       row.user = to;
//       row.balance = quantity;
//     });
//   }
// }
