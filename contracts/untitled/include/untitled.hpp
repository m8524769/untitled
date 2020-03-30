#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT untitled : public contract {
  public:
    using contract::contract;

    ACTION hi(name from, string message);
    ACTION clear();
    ACTION clearuser();
    ACTION inituser(name user, string info);

    ACTION createfile(uint64_t id, string filename, string description, asset price);
    ACTION buyfile(name buyer, uint64_t id);
    ACTION clearfile();

    // 监听 eosio.token 的 transfer 操作
    // [[eosio::on_notify("eosio.token::transfer")]]
    // void on_transfer(name from, name to, asset quantity, string memo);

  private:
    struct [[eosio::table]] message {
      name    user;
      string  text;
      auto primary_key() const { return user.value; }
    };

    struct [[eosio::table]] user {
      name    user;
      string  info;
      asset   balance;
      auto primary_key() const { return user.value; }
    };

    struct [[eosio::table]] file {
      uint64_t    id;
      name        owner;
      checksum256 hash;
      string      filename;
      string      description;
      uint64_t    size;
      asset       price;
      auto primary_key() const { return id; }
    };

    typedef multi_index<name("messages"), message> messages_table;
    typedef multi_index<name("users"), user> users_table;

    typedef multi_index<name("files"), file> files_table;
};
