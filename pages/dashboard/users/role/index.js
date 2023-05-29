export default {
  layout: "seller-layout",
  name: "IndexPage",
  data() {
    return {
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
          title: "สถานะ",
          width: "10%"
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
        data: [
          {
            id:0,
            name: 'super_admin',
            detail: '/',
            status: '/',
            created_at: '/',
            updated_at: '/',
          },
          {
            id:1,
            name: 'admin',
            detail: '/',
            status: '/',
            created_at: '/',
            updated_at: '/',
          },
        ]
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
        data: [
          {
            id:0,
            name: 'หน้าแรก',
            route: '/'
          },
          {
            id:1,
            name: 'รายงาน',
            route: `/dashboard`
          },
          {
            id:2,
            name: 'จัดการร้าน',
            route: '/dashboard/outlets'
          },
          {
            id:3,
            name: 'จัดการสาขา',
            route: '/dashboard/branch'
          },
          {
            id:4,
            name: 'รายรับ-รายจ่าย',
            route: '/dashboard/events'
          },
          {
            id:5,
            name: 'ผู้ใช้งาน',
            route: `/dashboard/users`
          },
        ]
      },
      per:{
        read: [],
        write:[],
        edit:[],
        remove: [],
      },
      item: {},
      switch1:false
    };
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    console.log(JSON.stringify(this.$auth.user))
    // this.getData()
  },
  methods: {
    changeSwitch(val){
      console.log(JSON.stringify(this.per)+"<<<")
    },
    async getData() {
      await this.$axios.get("/post", {
        params: {
          page: 20
        }
      }).then((res) => {
        console.log(res.data)
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      })
    },

    confirm() {
      console.log(JSON.stringify(this.per))
      // console.log(JSON.stringify(this.item))
      // if (this.item.id) {
      //   console.log("Update> " + this.item.id)
      //   this.onUpdate()
      // } else {
      //   console.log("Create> " + this.item.id)
      //   this.onCreate()
      // }
    },

    openItem(val) {
      console.log("val> " + val)
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/post/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/post", {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val) {
      this.dialog = false
      await this.$axios.delete("/post/" + val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
