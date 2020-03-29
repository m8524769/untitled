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
    });
  } else {
    users.modify(user_itr, user, [&](auto& row) {
      row.info = info;
    });
  }
}

EOSIO_DISPATCH(untitled, (hi)(clear)(inituser))
