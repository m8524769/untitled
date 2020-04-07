#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

class [[eosio::contract("untitled")]] untitled : public contract {
  public:
    using contract::contract;

    [[eosio::action]]
    void createfile(name owner, string cid, string description, asset price);

    [[eosio::action]]
    void sellfile(uint64_t id, asset price);

    [[eosio::action]]
    void placeorder(name buyer, uint64_t file_id);

    [[eosio::action]]
    void clearfiles();

    [[eosio::action]]
    void clearorders();

    [[eosio::on_notify("eosio.token::transfer")]]
    void on_transfer(name from, name to, asset quantity, string memo);

  private:
    struct [[eosio::table]] file {
      uint64_t  id;
      name      owner;
      string    cid;
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
      auto primary_key() const { return file_id; }
    };

    typedef multi_index<name("files"), file> files_table;
    typedef multi_index<name("orders"), order> orders_table;
};
