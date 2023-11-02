// import myFunction from "~/utils/myFunction";
import pkg from '~/package.json'
import isAdmin from "@/middleware/is-admin";
import dayjs from "dayjs";
import myUtils from "@/plugins/myUtils";
import convert from "@/plugins/convert";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการสิทธิ์",
      loading: true,
      dialog: false,
      tableHeadRole: [
        {
          title: "ชื่อสิทธิการใช้",
          width: ""
        },
        {
          title: "รายละเอียด",
          width: ""
        },
        {
          title: "สร้างเมื่อ",
          width: "10%%"
        },
        {
          title: "แก้ไขเมื่อ",
          width: "10%"
        },
      ],
      dessertsRole: {
        meta:{}
      },
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: ""
        },
        {
          title: "ผู้ใช้งาน",
          width: ""
        },
        {
          title: "อ่าน",
          width: "5%"
        },
        {
          title: "เขียน",
          width: "5%"
        },
        {
          title: "แก้ไข",
          width: "5%"
        },
        {
          title: "ลบ",
          width: "5%"
        },
      ],
      desserts: {
      },
      per: {
        titleBar:[],
        create: [],
        read: [],
        update: [],
        delete: [],
      },
      item: {},
      switch1: false,
      page:1
    };
  },
  computed: {
    convert() {
      return convert
    }
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  watch:{
    page(val) {
      this.getData()
    },
  },
  mounted() {
    this.getRoles()
    this.getModule()
  },
  methods: {
    myUtils,
    convertDay(val = "") {
      return dayjs().format("DD/MM/YYYY HH:mm")
    },
    async getModule() {
      await this.$axios.$get("/module").then((res) => {
        this.desserts = res
      }).catch((e) => {
        console.log(e)
      })
    },
    async getRoles() {
      await this.$axios.$get("/role").then((res) => {
        this.dessertsRole = res
        // console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
    changeSwitch(val) {
      // this.d.indexOf(val.title)
      let i = this.per.titleBar.indexOf(val)
      if (i !== -1) {
        this.per.titleBar.splice(i, 1)
      } else {
        this.per.titleBar.push(val)
      }
      // console.log(JSON.stringify(this.per) + "<<<"+JSON.stringify(val))
    },

    confirm() {
      this.per.titleBar.sort((a, b) => a.sort - b.sort)
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    openItem(val) {
      this.dialog = true
      // console.log(val.policy + "<<val> ")
      // this.per = {}
      // // this.item = {}
      this.item = Object.assign({}, val)
      if(val.policy === null) return
      this.per = Object.assign({}, JSON.parse(this.item.policy))
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.patch("/role/" + this.item.id, {
        id: this.item.id,
        name: this.item.name,
        detail: this.item.detail,
        status: 0,
        policy: JSON.stringify(this.per),
      }).then((res) => {
        this.getRoles()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/role", {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getBranch()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val) {
      this.dialog = false
      await this.$axios.delete("/post/" + val.id).then((res) => {
        this.getBranch()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
