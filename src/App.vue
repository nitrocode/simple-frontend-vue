<template>

  <div id="app">

    <!-- container for details -->
    <div id="container">
      <div id="details" class="column" v-if="showDetailsPopup">
        Status: {{ taskDetails.taskStatusId }}<br />
        Name: {{ taskDetails.name }}<br />
        Created by: {{ taskDetails.user.userName }} <img :src="taskDetails.user.imageUrl" /><br />
        Assigned: {{ taskDetails.assignedToUser.userName }} <img :src="taskDetails.assignedToUser.imageUrl" /><br />
        Due Date: {{ taskDetails.dueDate }}<br />
        Days left: {{ getDaysRemaining(taskDetails.dueDate) }}<br />
        Description: <p v-html="taskDetails.description"></p>
      </div>
    </div>

    <!-- container for columns -->
    <div id="container">
      <!-- create columns for each unique status -->
      <template v-for="status in getUniqueStatuses()">

        <div class="column" v-bind:key="status">
          <h3>{{ status }} {{ getTaskWithStatusPercent(status) }} %</h3>

          <div class="card" v-for="task in getTasksWithStatus(status)" :key="task.taskId">
            <div class="inside-card" v-on:click="showDetails(task.taskId)">
              {{task.name}}
              <template v-if="getDaysRemaining(task.dueDate) >= 0">({{ getDaysRemaining(task.dueDate) }} days left)</template>
              <template v-else>({{ Math.abs(getDaysRemaining(task.dueDate)) }} days overdue)</template>
            </div>
          </div>

        </div>

      </template>
    </div>

  </div>

</template>

<script>
/*eslint no-console: ["error", { allow: ["log"] }] */
export default {
	data: function() {
    return {
      tasks: [],
      taskDetails: {},
      showDetailsPopup: false
    }
  },
  // set tasks to data coming from json file
	created() {
    fetch('/v1/tasks')
      .then(res => res.json())
      .then(res => {
        this.tasks = res.tasks.map(task => {
          // consolidate different blocked status
          if (['Delayed', 'Stuck'].includes(task.taskStatusId)) {
            task.taskStatusId = 'Blocked';
          }
          return task;
        });
        // easy way to access object when debugging
        console.log(this.tasks);
      });
  },
  methods: {
    getDaysRemaining: function(dueDate) {
      return Math.round((new Date(dueDate).getTime() - Date.now()) / (60 * 60 * 24 * 1000));
    },
    getUniqueStatuses: function() { 
      return [...new Set(this.tasks.map(task => task.taskStatusId))]
    },
    getTasksWithStatus: function(status) {
      return this.tasks.filter(task => task.taskStatusId === status)
    },
    getTaskWithStatusPercent: function(status) {
      return this.getTasksWithStatus(status).length / this.tasks.length * 100;
    },
    showDetails: function(taskId) {
      this.taskDetails = this.tasks.find(task => task.taskId === taskId);
      // TODO: display w/ high z-index with an X button that toggles this off
      // this can also be toggled off if user clicks out of display box
      this.showDetailsPopup = true;
      return this.taskDetails;
    }
  }
}
</script>


<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}

#container {
  display: block;
  clear: both;
}

.column {
  float: left;
  background-color: #ebecf0;
  border-radius: 10px;
  margin: 5px;
}

.column h3 {
  padding-left: 10px;
}

.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 5px;
  width: 200px;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
  background-color: #fff;
  cursor: pointer;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.inside-card {
  padding: 16px;
  overflow: hidden;
  text-align: left;
  display: block;
  font-size: 0.83em;
}

#details {
  position: relative;
  margin: 0 auto;
  clear: left;
  height: auto;
  z-index: 0;
  margin-bottom: 10px;
  padding-left: 10px;
}

#details img {
  width: 20px;
}
</style>
