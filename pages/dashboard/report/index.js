import axios from "@/con/config";
import dayjs from "dayjs";
import 'dayjs/locale/th'
// import { GChart } from 'vue-google-charts'
import {GChart} from 'vue-google-charts/legacy'
import isAdmin from "@/middleware/is-admin";
// import { chartType, chartData, chartOptions } from './GoogleChartData';

export default {
  layout:"seller-layout",
  head() {
    return {
      title: 'รายงาน'
    }
  },
  middleware: ['auth'],
  components: {
    GChart
  },
  data() {
    return {
      loading: true,
      rules: [
        v => !!v || 'จำเป็น',
      ],
      instead: null,
      insteadSelect: null,
      typeChart: [
        {
          id: 0,
          name: "บุคลากร",
          url: ""
        },
        {
          id: 2,
          name: "อาจารย์",
          url: ""
        },
        {
          id: 1,
          name: "นักศึกษา"
        }
      ],
      typeChartSelect: [],
      typeRoom: [],
      typeRoomSelect: [],
      type: 'PieChart',
      pieChartData: [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7],
      ],
      pieChartOptions: {
        title: '',
        pieHole: 0.4,
        height: 344,
        legend: 'none',
      },
      data: [],
      options: {
        title: '',
        pieHole: 0.4,
        height: 600,
      },
      chartData: [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350],
      ],
      chartOptions: {
        title: '',
        width: 800,
        height: 344,
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
      },
      menuDate: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateEnd: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modal: false,
      dialogDateEnd: false,
      headerTable: [],
      desserts: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    this.typeChartSelect = this.typeChart[0]
    this.$nextTick(() => {
      // this.$nuxt.$loading.start()
      // this.getTypeRoom()
    })

    const items2D = [
      { id: 1, name: 'Item 1', parent: 'A' },
      { id: 2, name: 'Item 2', parent: 'B' },
      { id: 3, name: 'Item 3', parent: 'A' },
      { id: 4, name: 'Item 4', parent: 'B' },
      { id: 5, name: 'Item 5', parent: 'C' },
    ];

// Use reduce to group items by parent property
    const groupedItems2D = items2D.reduce((grouped, item) => {
      const parent = item.parent;

      if (!grouped[parent]) {
        grouped[parent] = [];
      }

      grouped[parent].push(item);

      return grouped;
    }, {});

    console.log(JSON.stringify(groupedItems2D));
  },
  methods: {
    getRoom(val) {
      this.$refs.menu.save(val)
      this.getLogStaff()
    },
    allowedDates(val) {
      let end = val > dayjs().add(2, "day").format("YYYY-MM-DD");
      return !(end);
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    async getLogStaff() {
      if (this.typeRoomSelect.id !== 1) {
        this.typeChartSelect = this.typeChart[0]
      }
      this.chartOptions.title = "จำนวนผู้ใช้งานเดือน " + dayjs(this.date).locale('th').add(543, 'year').format("MMMM YYYY")
      this.pieChartOptions.title = "ร้อยละการใช้งานเดือน " + dayjs(this.date).locale('th').add(543, 'year').format("MMMM YYYY")
      this.options.title = "จำนวนผู้ใช้งานปี " + dayjs(this.date).locale('th').add(543, 'year').format("YYYY")

      if (this.typeRoomSelect.id === 3) {
        await this.logStaffZoom()
        await this.logStaffMonthZoom()
        await this.logStaffPieZoom()
      } else {
        this.pieChartData = []
        let _type = this.typeChartSelect.id === 1 ? "logStudent" : "logStaff"
        this.headerTable = [
          {
            name: "ลำดับ",
            width: ""
          },
          {
            name: "หน่อยงาน",
            width: "60%"
          },
          {},{},{}
        ]
        await axios.get(`${_type}/${this.typeRoomSelect.id}`, {
          params: {
            date: this.date,
            typeChart: this.typeChartSelect.name
          }
        }).then((res) => {
          this.desserts = res.data
          // console.log(res.data)
          this.pieChartData = this.pieToArray(res.data)
          this.chartData = this.getChartData(res.data.length <= 0 ? [{master_department_name: "", total: 0}] : res.data)
          // this.chartOptions.title = "จำนวนผู้ใช้งานเดือน " + dayjs(this.date).locale('th').add(543, 'year').format("MMMM YYYY")
          // this.pieChartOptions.title = "ร้อยละการใช้งานเดือน " + dayjs(this.date).locale('th').add(543, 'year').format("MMMM YYYY")
          this.getYear()
        }).catch((error) => {
          this.$nuxt.$loading.finish()
          console.log(error.data)
        })
      }
    },
    async changeType() {
      await this.getLogStaff()
    },
    async logStaffZoom() {
      this.headerTable = [
        {
          name: "ลำดับ",
          width: ""
        },
        {
          name: "หน่อยงาน",
          width: "60%"
        },
        {
          name: "ห้อง 300",
          width: ""
        },
        {
          name: "ห้อง 500",
          width: ""
        },
        {
          name: "ห้อง 1000",
          width: ""
        }
      ]
      await axios.get(`logStaffZoom`, {
        params: {
          date: this.date
        }
      }).then((res) => {
        this.desserts = res.data
        this.chartData = this.toArrayZoom(res.data)
      }).catch((error) => {
        console.log(error.data)
      })
    },
    async logStaffPieZoom() {
      await axios.get(`logStaffPieZoom`, {
        params: {
          date: this.date
        }
      }).then((res) => {
        this.pieChartData = this.pieZoomToArray(res.data)
      }).catch((error) => {
        console.log(error.data)
      })
    },
    async logStaffMonthZoom() {
      await axios.get(`logStaffMonthZoom`, {
        params: {
          date: this.date
        }
      }).then((res) => {
        this.data = this.toArrayZoom(res.data)
      }).catch((error) => {
        console.log(error.data)
      })
    },
    pieToArray(data) {
      let refPieChart = [['', '']]
      data.map(async (da) => {
        let w = Object.keys(da).map((d) => {
          return da[d]
        })
        refPieChart.push(w)
      })
      return refPieChart
    },
    pieZoomToArray(data) {
      let w1 = ['ห้อง 300'], w2 = ['ห้อง 500'], w3 = ['ห้อง 1,000']
      let refPieChart = [['', '']]
      data.map(async (da) => {
        w1.push(da.small)
        w2.push(da.medium)
        w3.push(da.big)
        refPieChart.push(w1)
        refPieChart.push(w2)
        refPieChart.push(w3)
      })
      return refPieChart
    },
    toArrayZoom(d) {
      let refChartData = []
      let w0 = [''], w1 = ['300'], w2 = ['500'], w3 = ['1000']
      d.map(async (f) => {
        w0.push(f.master_department_name)
        w1.push(f.small)
        w2.push(f.medium)
        w3.push(f.big)
      })
      refChartData.push(w0)
      refChartData.push(w1)
      refChartData.push(w2)
      refChartData.push(w3)
      return refChartData;
    },
    getChartData(d) {
      let refChartData = []
      let w1 = [''], w2 = ['']
      d.map(async (f) => {
        w1.push(f.master_department_name)
        w2.push(f.total)
      })
      refChartData.push(w1)
      refChartData.push(w2)
      return refChartData;
    },
    async getTypeRoom() {
      await axios.get(`type_room`).then((res) => {
        this.typeRoom = res.data
        this.typeRoomSelect = this.typeRoom[0]
        this.getLogStaff()
      }).catch((error) => {
        this.$nuxt.$loading.finish()
        console.log(error)
      })
    },
    async getYear() {
      let _type = this.typeChartSelect.id === 0 ? "getMonth" : "getMonthStudent"
      // console.log(_type)
      await axios.get(`${_type}/${this.typeRoomSelect.id}`, {
        params: {
          date: this.date
        }
      }).then((res) => {
        // this.options.title = "จำนวนผู้ใช้งานปี " + dayjs(this.date).locale('th').add(543, 'year').format("YYYY")
        if (res.data.length <= 0) {
          this.data = this.getChartData([{master_department_name: "", total: 0}])
          return
        }
        this.data = this.getChartData(res.data)
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        this.$nuxt.$loading.finish()
        console.log(error)
      })
    }
  },
}
