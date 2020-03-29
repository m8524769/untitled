#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT untitled : public contract {
  public:
    using contract::contract;

    ACTION hi(name from, string message);
    ACTION clear();

    ACTION inituser(name user, string info);

  private:
    TABLE messages {
      name    user;
      string  text;
      auto primary_key() const { return user.value; }
    };

    TABLE users {
      name    user;
      string  info;
      auto primary_key() const { return user.value; }
    };

    typedef multi_index<name("messages"), messages> messages_table;
    typedef multi_index<name("users"), users> users_table;
};
