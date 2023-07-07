import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";

export default {
  // middleware: "auth",
  layout: "pos-layout",
  data: () => ({
    loading: false,
    cards: {},
    calories: '',
    tableHead: [
      {
        title: "ชื่อรายการ",
        width: "",
        text: "text-left"
      },
      {
        title: "จำนวน",
        width: "15%",
        text: "text-center"
      },
      {
        title: "ราคา",
        width: "20%",
        text: "text-right"
      },
    ],
    desserts: [],
    discount: [],
    discountSel: [],
    tags: {},
    total:1,
    dd:1,
    rules: {
      required: value => !!value || 'Required.',
      min: value => value >= 1,
      max: value => value <= 99,
    }
  }),
  computed: {
    convert() {
      return convert
    },
    roles() {
      return this.$auth.user.roles <= 2;
    },
  },
  watch: {
    // dialog(val) {
    //   val || this.close()
    // },
    countOrder(val){
      console.log(this.desserts)
      return '1'
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },

  mounted() {
    this.getData()
    this.getDiscount()
    this.getType()
  },

  methods: {
    addDiscount(val) {
      val.total = 1
      this.discountSel.push(val)
      console.log(this.discountSel)
    },
    removeDiscount(val) {
      this.discountSel.splice(this.discountSel.indexOf(val), 1)
    },

    addOrder(val) {
      val.total = 1
      this.desserts.push(val)
    },
    removeOrder(val) {
      this.desserts.splice(this.desserts.indexOf(val), 1)
    },

    onConfirm() {
      console.log("")
    },
    myUtils,
    convertDay(day) {
      return dayjs(day).format("DD-MM-YYYY HH:mm:ss");
    },

    async getDiscount() {
      await this.$axios.get("/getDiscountForUse").then((res) => {
        this.discount = res.data
      }).catch((error) => {
        console.log(error);
      });
    },

    async getData(_type = "") {
      await this.$axios.get("/posProduct", {
        params: {
          type: _type
        }
      }).then((res) => {
        this.cards = res.data
      }).catch((error) => {
        console.log(error);
      });
    },

    async deleteItemConfirm() {
      console.log(JSON.stringify(this.editedItem));
      await this.$axios.delete(`/places/${this.editedItem.id}`).then(() => {
        this.getData();
        this.closeDelete();
      }).catch((error) => {
        console.log(error);
      });
    },

    async getType() {
      await this.$axios.get("/posProductType").then((res) => {
        this.tags = res.data;
      }).catch((error) => {
        console.log(error);
      });
    },

    async searchPlaces() {
      await this.$axios.get(`/filter_places`, {
        params: {
          search: this.search,
        },
      }).then((response) => {
        this.desserts = response.data;
      }).catch((error) => {
        alert(error);
        console.log(error);
      });
    },

    async createItem() {
      await this.getPlaceList();
      this.$store.commit("setReadOnly", false);
      await this.$router.push("/update");
    },

    async editItem(item) {
      await this.$router.push({
        path: "/update",
        query: {
          edite: Object.assign({}, item).id,
        },
      });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    closeDelete() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
