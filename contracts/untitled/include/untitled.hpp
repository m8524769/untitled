#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using namespace std;
using namespace eosio;

class [[eosio::contract("untitled")]] untitled : public contract {
  public:
    using contract::contract;

    [[eosio::action]]
    void createfile(name owner, string encrypted_cid, string cid_hash, string description, uint64_t size, asset price);

    [[eosio::action]]
    void sellfile(uint64_t id, asset price);

    [[eosio::action]]
    void placeorder(name buyer, uint64_t file_id);

    [[eosio::action]]
    void cancelorder(uint64_t file_id);

    [[eosio::action]]
    void clearfiles(name account);

    [[eosio::action]]
    void clearorders(name account);

    [[eosio::action]]
    void setkey(name account, string rsa_public_key);

    [[eosio::on_notify("eosio.token::transfer")]]
    void on_transfer(name from, name to, asset quantity, string memo);

  private:
    static const uint32_t order_security_period = 900;  // 15 miniutes

    struct [[eosio::table]] file {
      uint64_t  id;
      name      owner;
      string    encrypted_cid;
      string    cid_hash;
      string    description;
      uint64_t  size;
      bool      for_sale;
      asset     price;
      auto primary_key() const { return id; }
    };

    struct [[eosio::table]] order {
      uint64_t  file_id;
      name      buyer;
      asset     price;
      uint32_t  create_time;
      auto primary_key() const { return file_id; }
    };

    struct [[eosio::table]] rsa_key {
      string    public_key;
      auto primary_key() const { return 0; }
    };

    typedef multi_index<name("files"), file> files_table;
    typedef multi_index<name("orders"), order> orders_table;
    typedef multi_index<name("rsa.keys"), rsa_key> rsa_key_table;

    uint32_t now() {
      return current_time_point().sec_since_epoch();
    }
};
