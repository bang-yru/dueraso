<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="ภาพรวมรายงาน" class="text-right">
            <v-row class="m-0" style="justify-content: right;">
              <v-autocomplete
                outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                class="ml-2"
                hide-selected return-object label="เลือกร้าน" dense item-text="name" item-value="id" hide-details
                style="border-radius: 15px; min-width: 300px; max-width: 400px"
              ></v-autocomplete>
              <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="วันที่เริ่ม"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="border-radius: 15px; min-width: 200px; max-width: 200px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="modal = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="$refs.dialog.save(date)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog ref="dialog2" v-model="dialogDateEnd" :return-value.sync="dateEnd" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateEnd"
                    label="วันที่สิ้นสุด"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="border-radius: 15px; min-width: 200px; max-width: 200px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateEnd" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="dialogDateEnd = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="$refs.dialog2.save(dateEnd)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-row>
          </head-bar>
          <!--          <v-col>-->
          <!--            <v-row>-->
          <!--              <v-col>-->
          <!--                <v-chart :options="chartOptions">-->
          <!--                  <v-bar-->
          <!--                    v-for="item in chartData"-->
          <!--                    :key="item.label"-->
          <!--                    :value="item.value"-->
          <!--                    :label="item.label"-->
          <!--                  ></v-bar>-->
          <!--                </v-chart>-->
          <!--              </v-col>-->
          <!--            </v-row>-->
          <!--          </v-col>-->
          <v-col>
            <h4 style="color: #5B4840">ยอดรายรับรายจ่าย</h4>
            <v-row>
              <v-col cols="12" sm="7">
                <GChart
                  type="ColumnChart"
                  :data="chartData"
                  :options="chartOptions">
                </GChart>
              </v-col>
              <v-col>
                <v-card class="m-0 ml-2 p-3" style="border-radius: 15px" height="85px">
                  <v-row style="height: 78px">
                    <v-col cols="8" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">ขายสินค้าไปทั้งหมด</h5>
                    </v-col>
                    <v-col cols="2" class="align-self-center">
                      <h2 class="m-0" style="color:#A57156;">
                        <strong>56</strong>
                      </h2>
                    </v-col>
                    <v-col class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">รายการ</h5>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="m-0 ml-2 p-3 mt-3" style="border-radius: 15px" height="85px">
                  <v-row style="height: 78px">
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">จ่ายเงินสด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h2 class="m-0" style="color:#21CEC7;">
                        <strong>
                          38 %
                        </strong>
                      </h2>
                    </v-col>
                    <v-divider vertical style="color: #A57156"></v-divider>
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">จ่ายเงินสด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h2 class="m-0" style="color:#68CB11;">
                        <strong>
                          62 %
                        </strong>
                      </h2>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="m-0 ml-2 p-3 mt-3" style="border-radius: 15px" height="150px">
                  <v-row>
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">กำไรมากที่สุด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h5 class="m-0" style="color:#A57156;">6,500 บาท</h5>
                    </v-col>
                    <v-divider vertical style="color: #A57156"></v-divider>
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">กำไรน้อยที่สุด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h5 class="m-0" style="color:#A57156;">3,150 บาท</h5>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" class="align-self-center">
                      <h1 class="m-0" style="color: #A57156">
                        <strong>
                          กรุงเทพ กกท
                        </strong>
                      </h1>
                    </v-col>
                    <v-divider vertical style="color: #A57156"/>
                    <v-col cols="6" class="align-self-center">
                      <h1 class="m-0" style="color: #A57156">
                        <strong>
                          หลัง วค.
                        </strong>
                      </h1>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <h4 style="color: #5B4840">
                  รายรับ
                </h4>
                <GChart
                  :type="type"
                  :data="pieChartData"
                  :options="pieChartOptions"
                />
              </v-col>
              <v-col cols="3">
                <h4 style="color: #5B4840">
                  รายจ่าย
                </h4>
                <GChart
                  :type="type"
                  :data="pieChartData"
                  :options="pieChartOptions"
                />
              </v-col>
              <v-col>
                <h4 style="color: #5B4840" class="m-0">
                  สินค้ายอดนิยม
                </h4>
                <v-card style="border-radius: 15px" class="mt-3">
                  <v-row class="m-0">
                    <h3 class="m-0 align-self-center" style="padding: 12px">
                      <strong style="color: #E8AF14">1</strong>
                    </h3>
                    <v-col class="m-0 align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        เสื้อชีฟอง
                      </p>
                    </v-col>
                    <v-col cols="3" class="text-right align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        15 รายการ
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card style="border-radius: 15px" class="mt-3">
                  <v-row class="m-0">
                    <h3 class="m-0 align-self-center" style="padding: 12px">
                      <strong style="color: #E8AF14">1</strong>
                    </h3>
                    <v-col class="m-0 align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        เสื้อชีฟอง
                      </p>
                    </v-col>
                    <v-col cols="3" class="text-right align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        15 รายการ
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card style="border-radius: 15px" class="mt-3">
                  <v-row class="m-0">
                    <h3 class="m-0 align-self-center" style="padding: 12px">
                      <strong style="color: #E8AF14">1</strong>
                    </h3>
                    <v-col class="m-0 align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        เสื้อชีฟอง
                      </p>
                    </v-col>
                    <v-col cols="3" class="text-right align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        15 รายการ
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card style="border-radius: 15px" class="mt-3">
                  <v-row class="m-0">
                    <h3 class="m-0 align-self-center" style="padding: 12px">
                      <strong style="color: #E8AF14">1</strong>
                    </h3>
                    <v-col class="m-0 align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        เสื้อชีฟอง
                      </p>
                    </v-col>
                    <v-col cols="3" class="text-right align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        15 รายการ
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card style="border-radius: 15px" class="mt-3">
                  <v-row class="m-0">
                    <h3 class="m-0 align-self-center" style="padding: 12px">
                      <strong style="color: #E8AF14">1</strong>
                    </h3>
                    <v-col class="m-0 align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        เสื้อชีฟอง
                      </p>
                    </v-col>
                    <v-col cols="3" class="text-right align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        15 รายการ
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!--                      </v-col>-->
          <!--                      <v-col cols="12" sm="6">-->
          <!--                        <GChart-->
          <!--                          :type="type"-->
          <!--                          :data="pieChartData"-->
          <!--                          :options="pieChartOptions"-->
          <!--                        />-->
          <!--                      </v-col>-->
          <!--                      <v-col cols="12">-->
          <!--                                  <GChart type="BarChart" :data="data" :options="options"/>-->
          <!--                      </v-col>-->
          <!--                    </v-row>-->
          <!--                  </b-tab>-->
          <!--                  <b-tab title="ตาราง" @click="getLogStaff">-->
          <!--                    <v-col style="background-color: #EEF7F6;" class="mt-3">-->
          <!--                      <h6 class="mb-0" style="color: #2196f3">ตาราง{{ chartOptions.title }}</h6>-->
          <!--                    </v-col>-->
          <!--                    <v-simple-table>-->
          <!--                      <template v-slot:default>-->
          <!--                        <thead>-->
          <!--                        <tr>-->
          <!--                          <th class="text-left" style="color: #2196f3; font-size: 16px" v-for="(item, i) in headerTable"-->
          <!--                              :key="i" :width="item.width">-->
          <!--                            {{ item.name }}-->
          <!--                          </th>-->
          <!--                          <th class="text-left" style="color: #2196f3; font-size: 16px">-->
          <!--                            จำนวน-->
          <!--                          </th>-->
          <!--                        </tr>-->
          <!--                        </thead>-->
          <!--                        <tbody>-->
          <!--                        <tr v-for="(item, i) in desserts" :key="i">-->
          <!--                          <td>{{ i + 1 }}</td>-->
          <!--                          <td>{{ item.master_department_name }}</td>-->
          <!--                          <td>{{ item.small }}</td>-->
          <!--                          <td>{{ item.medium }}</td>-->
          <!--                          <td>{{ item.big }}</td>-->
          <!--                          <td>{{ Number(item.total.toFixed(1)).toLocaleString() }}</td>-->
          <!--                        </tr>-->
          <!--                        <tr>-->
          <!--                          <td colspan="2">-->
          <!--                            <h6>รวม</h6>-->
          <!--                          </td>-->
          <!--                          <td>-->
          <!--                            <h6>-->
          <!--                              {{-->
          <!--                                desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {small}) => n + small, 0).toFixed(1)).toLocaleString()-->
          <!--                              }}-->
          <!--                            </h6>-->
          <!--                          </td>-->
          <!--                          <td>-->
          <!--                            <h6>-->
          <!--                              {{-->
          <!--                                desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {medium}) => n + medium, 0).toFixed(1)).toLocaleString()-->
          <!--                              }}-->
          <!--                            </h6>-->
          <!--                          </td>-->
          <!--                          <td>-->
          <!--                            <h6>-->
          <!--                              {{-->
          <!--                                desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {big}) => n + big, 0).toFixed(1)).toLocaleString()-->
          <!--                              }}-->
          <!--                            </h6>-->
          <!--                          </td>-->
          <!--                          <td>-->
          <!--                            <h6>-->
          <!--                              {{ Number(desserts.reduce((n, {total}) => n + total, 0).toFixed(1)).toLocaleString() }}-->
          <!--                            </h6>-->
          <!--                          </td>-->
          <!--                        </tr>-->
          <!--                        </tbody>-->
          <!--                      </template>-->
          <!--                    </v-simple-table>-->
          <!--                  </b-tab>-->
          <!--                </b-tabs>-->
          <!--              </v-col>-->
          <!--              &lt;!&ndash;          <v-col cols="12" sm="4">&ndash;&gt;-->
          <!--              &lt;!&ndash;            <v-autocomplete&ndash;&gt;-->
          <!--              &lt;!&ndash;              outlined&ndash;&gt;-->
          <!--              &lt;!&ndash;              auto-select-first&ndash;&gt;-->
          <!--              &lt;!&ndash;              :items="typeRoom"&ndash;&gt;-->
          <!--              &lt;!&ndash;              v-model="typeRoomSelect"&ndash;&gt;-->
          <!--              &lt;!&ndash;              @change="getLogStaff"&ndash;&gt;-->
          <!--              &lt;!&ndash;              return-object&ndash;&gt;-->
          <!--              &lt;!&ndash;              item-text="title"&ndash;&gt;-->
          <!--              &lt;!&ndash;              item-value="id"&ndash;&gt;-->
          <!--              &lt;!&ndash;              label="ชื่อประเภทห้อง"&ndash;&gt;-->
          <!--              &lt;!&ndash;              dense&ndash;&gt;-->
          <!--              &lt;!&ndash;              hide-details&ndash;&gt;-->
          <!--              &lt;!&ndash;            ></v-autocomplete>&ndash;&gt;-->
          <!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
          <!--              &lt;!&ndash;          <v-col cols="12" sm="4" v-show="typeRoomSelect.id === 1">&ndash;&gt;-->
          <!--              &lt;!&ndash;            <v-autocomplete&ndash;&gt;-->
          <!--              &lt;!&ndash;              outlined&ndash;&gt;-->
          <!--              &lt;!&ndash;              auto-select-first&ndash;&gt;-->
          <!--              &lt;!&ndash;              :items="typeChart"&ndash;&gt;-->
          <!--              &lt;!&ndash;              v-model="typeChartSelect"&ndash;&gt;-->
          <!--              &lt;!&ndash;              @change="changeType"&ndash;&gt;-->
          <!--              &lt;!&ndash;              return-object&ndash;&gt;-->
          <!--              &lt;!&ndash;              item-text="name"&ndash;&gt;-->
          <!--              &lt;!&ndash;              item-value="id"&ndash;&gt;-->
          <!--              &lt;!&ndash;              label="ประเภทผู้ใช้งาน"&ndash;&gt;-->
          <!--              &lt;!&ndash;              dense&ndash;&gt;-->
          <!--              &lt;!&ndash;              hide-details&ndash;&gt;-->
          <!--              &lt;!&ndash;            ></v-autocomplete>&ndash;&gt;-->
          <!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
          <!--              &lt;!&ndash;          <v-col cols="12" sm="4">&ndash;&gt;-->
          <!--              &lt;!&ndash;            <v-menu&ndash;&gt;-->
          <!--              &lt;!&ndash;              ref="menu"&ndash;&gt;-->
          <!--              &lt;!&ndash;              v-model="menuDate"&ndash;&gt;-->
          <!--              &lt;!&ndash;              :close-on-content-click="false"&ndash;&gt;-->
          <!--              &lt;!&ndash;              :return-value.sync="date"&ndash;&gt;-->
          <!--              &lt;!&ndash;              transition="scale-transition"&ndash;&gt;-->
          <!--              &lt;!&ndash;              offset-y&ndash;&gt;-->
          <!--              &lt;!&ndash;              max-width="290px"&ndash;&gt;-->
          <!--              &lt;!&ndash;              min-width="auto"&ndash;&gt;-->
          <!--              &lt;!&ndash;            >&ndash;&gt;-->
          <!--              &lt;!&ndash;              <template v-slot:activator="{ on, attrs }">&ndash;&gt;-->
          <!--              &lt;!&ndash;                <v-text-field&ndash;&gt;-->
          <!--              &lt;!&ndash;                  v-model="date"&ndash;&gt;-->
          <!--              &lt;!&ndash;                  outlined&ndash;&gt;-->
          <!--              &lt;!&ndash;                  dense&ndash;&gt;-->
          <!--              &lt;!&ndash;                  label="เลือกเดือน/ปี"&ndash;&gt;-->
          <!--              &lt;!&ndash;                  append-icon="mdi-calendar-outline"&ndash;&gt;-->
          <!--              &lt;!&ndash;                  readonly&ndash;&gt;-->
          <!--              &lt;!&ndash;                  v-bind="attrs"&ndash;&gt;-->
          <!--              &lt;!&ndash;                  v-on="on"&ndash;&gt;-->
          <!--              &lt;!&ndash;                ></v-text-field>&ndash;&gt;-->
          <!--              &lt;!&ndash;              </template>&ndash;&gt;-->
          <!--              &lt;!&ndash;              <v-date-picker&ndash;&gt;-->
          <!--              &lt;!&ndash;                :allowed-dates="allowedDates"&ndash;&gt;-->
          <!--              &lt;!&ndash;                locale="th"&ndash;&gt;-->
          <!--              &lt;!&ndash;                v-model="date"&ndash;&gt;-->
          <!--              &lt;!&ndash;                type="month"&ndash;&gt;-->
          <!--              &lt;!&ndash;                no-title&ndash;&gt;-->
          <!--              &lt;!&ndash;                scrollable&ndash;&gt;-->
          <!--              &lt;!&ndash;              >&ndash;&gt;-->
          <!--              &lt;!&ndash;                <v-spacer></v-spacer>&ndash;&gt;-->
          <!--              &lt;!&ndash;                <v-btn text color="primary" @click="menuDate = false">&ndash;&gt;-->
          <!--              &lt;!&ndash;                  Cancel&ndash;&gt;-->
          <!--              &lt;!&ndash;                </v-btn>&ndash;&gt;-->
          <!--              &lt;!&ndash;                <v-btn text color="primary" @click="getRoom(date)">&ndash;&gt;-->
          <!--              &lt;!&ndash;                  OK&ndash;&gt;-->
          <!--              &lt;!&ndash;                </v-btn>&ndash;&gt;-->
          <!--              &lt;!&ndash;              </v-date-picker>&ndash;&gt;-->
          <!--              &lt;!&ndash;            </v-menu>&ndash;&gt;-->
          <!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
          <!--              &lt;!&ndash;          <v-col cols="12" sm="6">&ndash;&gt;-->
          <!--              &lt;!&ndash;            <GChart&ndash;&gt;-->
          <!--              &lt;!&ndash;              type="ColumnChart"&ndash;&gt;-->
          <!--              &lt;!&ndash;              :data="chartData"&ndash;&gt;-->
          <!--              &lt;!&ndash;              :options="chartOptions">&ndash;&gt;-->
          <!--              &lt;!&ndash;            </GChart>&ndash;&gt;-->
          <!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
          <!--              &lt;!&ndash;          <v-col cols="12" sm="6">&ndash;&gt;-->
          <!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
          <!--              &lt;!&ndash;          <v-col cols="12">&ndash;&gt;-->
          <!--              &lt;!&ndash;            <GChart type="BarChart" :data="data" :options="options"/>&ndash;&gt;-->
          <!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
          <!--            </v-row>-->
          <!--          </v-card>-->
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
<style src="./index.css"/>
