<template>
<v-col>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card max-width="auto">
            <v-data-table :headers="headers" :items="datas" class>
              <template #item.date="{item}">{{item.userworkdate}}</template>
              <template #item.counter="{item}">{{item.userworkcounter}}</template>
              <template #item.distance="{item}">{{item.userworkdistance}}</template>
              <template #item.time="{item}">{{item.userworktime}}</template>
              <template #item.speed="{item}">{{item.userworkpace}}</template>
              <template #item.calorie="{item}">{{item.userworkcal}}</template>
              <template #item.startedtime="{item}">{{item.userworkstarttime}}</template>
            </v-data-table>
          </v-card>

          <v-card max-width="auto" class="cardsum text-center pa-3" v-if="checkData == true">
            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col>
                    <strong class="blue-grey--text">ผลรวมระยะทาง (กิโลเมตร)</strong>
                    <p>{{sumdistance}}</p>
                  </v-col>
                  <v-col>
                    <strong class="blue-grey--text">ความเร็วเฉลี่ย (นาที/กิโลเมตร)</strong>
                    <p>{{sumpace}}</p>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col>
                    <strong class="blue-grey--text">ผลรวมระยะเวลา (ชม:นาที:วินาที)</strong>
                    <p>{{sumtime}}</p>
                  </v-col>
                  <v-col>
                    <strong class="blue-grey--text">ผลรวมแคลลอรี่ (กิโลแคลลอรี่)</strong>
                    <p>{{sumcal}}</p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
</v-col>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "ครั้งที่", value: "counter" },
        { text: "วันที่", value: "date" },
        { text: "ระยะทาง(กิโลเมตร)", value: "distance" },
        { text: "เวลา(ชั่วโมง)", value: "time" },
        { text: "ความเร็วเฉลี่ย(นาที/กิโลเมตร)", value: "speed" },
        { text: "พลังงานที่ใช้(กิโลแคลลอรี่)", value: "calorie" },
        { text: "เวลาเริ่ม", value: "startedtime" }
      ],
      datas: this.$store.getters.datatable,
      sumdistance: 0,
      sumcal: 0,
      sumtime: null,
      sumpace: null
    };
  },
  created: async function() {
    let i = 0;
    let temp_distance = 0;
    let temp_cal = 0;
    let timesplit;
    let pacesplit;
    let hour_time = 0;
    let minute_time = 0;
    let second_time = 0;
    let hour_pace = 0;
    let minute_pace = 0;
    let sum_pace;
    for (i = 0; i < this.datas.length; i++) {
      //Sum distance
      temp_distance =
        temp_distance + parseFloat(this.datas[i].userworkdistance);
      //Sum calrorie
      temp_cal = temp_cal + parseFloat(this.datas[i].userworkcal);
      //Sum time
      timesplit = this.datas[i].userworktime.split(":");
      hour_time = hour_time + parseInt(timesplit[0]);
      minute_time = minute_time + parseInt(timesplit[1]);
      second_time = second_time + parseInt(timesplit[2]);
      //Sum pace
      pacesplit = this.datas[i].userworkpace.split(":");
      hour_pace = hour_pace + parseInt(pacesplit[0]);
      minute_pace = minute_pace + parseInt(pacesplit[1]);
    }
    //Cal time
    hour_time = hour_time + Math.floor(minute_time / 60);
    minute_time = minute_time % 60;
    minute_time = minute_time + Math.floor(second_time / 60);
    second_time = second_time % 60;
    if (minute_time < 10) {
      minute_time.toString;
      minute_time = "0" + minute_time;
    }
    if (second_time < 10) {
      second_time.toString;
      second_time = "0" + second_time;
    }
    hour_time.toString;
    //Cal Pace
    sum_pace = hour_pace * 60 + minute_pace;
    let templength = parseInt(this.datas.length);
    let avg = Math.round(sum_pace / templength);
    let finalpacemin = Math.floor(avg / 60);
    let finalpacesec = avg % 60;
    if (finalpacesec < 10) {
      finalpacesec.toString;
      finalpacesec = "0" + finalpacesec;
    }
    finalpacemin.toString;
    this.sumpace = finalpacemin + ":" + finalpacesec;
    this.sumtime = hour_time + ":" + minute_time + ":" + second_time;
    (this.sumdistance = temp_distance.toPrecision(5)), (this.sumcal = temp_cal);
  },

  computed: {
    checkData() {
      if (this.datas.length == 0) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>



<style scoped>
.cardsum {
  margin-top: 10%;
}
</style>