#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

class [[eosio::contract("untitled")]] untitled : public contract {
  public:
    using contract::contract;

    [[eosio::action]]
    void hi(name from, string message);

    [[eosio::action]]
    void clear();

    [[eosio::action]]
    void clearuser();

    [[eosio::action]]
    void inituser(name user, string info);

    [[eosio::action]]
    void createfile(string cid, string description, asset price);

    [[eosio::action]]
    void buyfile(name buyer, uint64_t id);

    [[eosio::action]]
    void clearfile();

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
      name      owner;
      string    cid;
      string    description;
      uint64_t  size;
      asset     price;
      auto primary_key() const { return cid.code().raw(); }
    };

    typedef multi_index<name("messages"), message> messages_table;
    typedef multi_index<name("users"), user> users_table;

    typedef multi_index<name("files"), file> files_table;
};
