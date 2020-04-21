#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using namespace std;
using namespace eosio;

class [[eosio::contract("untitled")]] untitled : public contract {
  public:
    using contract::contract;

    [[eosio::action]]
    void createfile(name owner, checksum256 cid_hash, string encrypted_cid, string description, uint64_t size, asset price);

    [[eosio::action]]
    void sellfile(uint64_t file_id, string encrypted_cid, asset price);

    [[eosio::action]]
    void modifyfile(uint64_t file_id, string description, asset price);

    [[eosio::action]]
    void placeorder(name buyer, uint64_t file_id);

    [[eosio::action]]
    void cancelorder(uint64_t file_id);

    [[eosio::action]]
    void updatecid(uint64_t file_id, string encrypted_cid);

    [[eosio::action]]
    void discontinue(uint64_t file_id);

    [[eosio::action]]
    void clearfiles();

    [[eosio::action]]
    void clearorders();

    [[eosio::action]]
    void setkey(name account, string rsa_public_key);

    [[eosio::on_notify("eosio.token::transfer")]]
    void on_transfer(name from, name to, asset quantity, string memo);

  private:
    const symbol default_symbol = symbol(symbol_code("ASS"), 4);
    static const uint16_t exchange_rate = 10;  // 1 EOS = 1 ASS * exchange_rate
    static const uint32_t order_security_period = 900;  // 15 miniutes

    struct [[eosio::table]] file {
      uint64_t     id;
      name         owner;
      checksum256  cid_hash;
      string       encrypted_cid;
      string       description;
      uint64_t     size;
      bool         for_sale;
      asset        price;
      uint64_t primary_key() const { return id; }
      uint64_t get_owner() const { return owner.value; }
      checksum256 get_cid_hash() const { return cid_hash; }
    };

    struct [[eosio::table]] order {
      uint64_t     file_id;
      name         buyer;
      asset        price;
      uint32_t     create_time;
      uint64_t primary_key() const { return file_id; }
      uint64_t get_buyer() const { return buyer.value; }
    };

    // Index by Scope (account name)
    struct [[eosio::table]] rsa_key {
      string       public_key;
      uint64_t primary_key() const { return 0; }
    };

    typedef multi_index<"files"_n, file,
      indexed_by<"byowner"_n, const_mem_fun<file, uint64_t, &file::get_owner>>,
      indexed_by<"bycidhash"_n, const_mem_fun<file, checksum256, &file::get_cid_hash>>
    > files_table;

    typedef multi_index<"orders"_n, order,
      indexed_by<"bybuyer"_n, const_mem_fun<order, uint64_t, &order::get_buyer>>
    > orders_table;

    typedef multi_index<"rsa.keys"_n, rsa_key> rsa_key_table;

    uint32_t now() {
      return current_time_point().sec_since_epoch();
    }
};
