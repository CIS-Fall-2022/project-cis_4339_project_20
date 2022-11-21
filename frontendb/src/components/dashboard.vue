//Portions of table style referenced from W3 Schools: https://www.w3schools.com/html/html_tables.asp
<style> 
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 80%;
  margin: 5% 5% 5% 5%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>

<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome to Your Dashboard</h1>
    </div>
    <div>
      <h1 class="font-bold text-4xl text-blue-500 tracking-widest text-center mt-10">Events & Attendees - Past 2 Months</h1>
    </div>
    <section class="container">
      <div class="column">
        <div>
          <div>
            <EnrollmentBar
              v-if="!loading && !error"
              :label="labels"
              :chart-data="enrolled"
            ></EnrollmentBar>

            <!-- Start of loading animation -->
            <div class="mt-40" v-if="loading">
              <p
                class="
                  text-6xl
                  font-bold
                  text-center text-gray-500
                  animate-pulse
                "
              >
                Loading...
              </p>
            </div>
            <!-- End of loading animation -->

            <!-- Start of error alert -->
            <div class="mt-12 bg-red-50" v-if="error">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ error.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ error.message }}
              </p>
            </div>
            <!-- End of error alert -->
            <br />
            <br />
          </div>
        </div>
      </div>
  </section>
  <section class="container">
  <div class="row justify-content-center">
    <table>
      <thead>
        <tr class=" text-justify-content-center">
          <th>Event Name</th>
          <th># of Attendees</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="attendee in Attendees" :key="attendee._id">
          <td>{{ attendee.name }}</td>
          <td>{{ attendee.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </section>
  </main>
</template>

<script>
import axios from "axios";
import EnrollmentBar from "@/components/BarChartComponent.vue";

export default {
  components: {
    EnrollmentBar,
  },
  data() {
    return {
      labels: [],
      enrolled: [],
      loading: false,
      error: null,
    };
  },
  created() {
            let apiURL = 'http://localhost:3002/eventdata/eventgraph';
            axios.get(apiURL).then(res => {
                this.Attendees = res.data;
            }).catch(error => {
                console.log(error)
            });
        },
  methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        const url = `http://localhost:3002/eventdata/eventgraph`;
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.labels = response.data.map((item) => item.name);
        this.enrolled = response.data.map((item) => item.total);
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
