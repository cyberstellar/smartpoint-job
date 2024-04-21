<template>
  <div>
    <div class="table-operations">
      <a-button @click="fillTable">Заполнить</a-button>
      <a-button @click="open = true" type="primary">Добавить</a-button>
    </div>
    <a-table :columns="columns" :data-source="dataSource" sticky ref="tableRef" />
    <a-modal
        v-model:open="open"
        title="Добавить город"
        @ok="addCity"
        @cancel="formRef.resetFields()"
    >
      <a-form
          ref="formRef"
          v-bind="layout"
          :model="formState"
          @submit="addCity"
          @keydown.enter.native="addCity"
      >
        <a-form-item label="Название" name="city" required>
          <a-input v-model:value="formState.city" />
        </a-form-item>
        <a-form-item label="Количество жителей" name="population" :rules="[{ type: 'number', min: 1 }]">
          <a-input-number v-model:value="formState.population" :min="0" />
        </a-form-item>
        <a-form-item label="Количество автомобилей" name="cars" :rules="[{ type: 'number', min: 1 }]">
          <a-input-number v-model:value="formState.cars" :min="0" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>


<script setup>
import { computed, reactive, ref } from 'vue'

const API_BASE = 'http://localhost:3001'

const dataSource = ref([])
const open = ref(false)
const formRef = ref()
const tableRef = ref()

const formState = reactive({
  city: '',
  population: 0,
  cars: 0
})

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 16,
  },
}

const formatter = new Intl.NumberFormat('ru-RU')

const columns = computed(() => {
  return [
    {
      title: 'Город',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city)
    },
    {
      title: 'Количество жителей',
      dataIndex: 'population',
      key: 'population',
      width: '30%',
      sorter: (a, b) => a.population - b.population,
      customRender: ({ value }) => formatter.format(value)
    },
    {
      title: 'Количество авто',
      dataIndex: 'cars',
      key: 'cars',
      width: '30%',
      sorter: (a, b) => a.cars - b.cars,
      customRender: ({ value }) => formatter.format(value)
    }
  ]
})

async function fetchData(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    console.log('HTTP error:', response.status)
    return
  }
  return response.json()
}

async function fillTable() {
  dataSource.value = await fetchData(`${API_BASE}/cities`)
}

function addCity() {
  formRef.value.validate()
      .then(async () => {
        await fetchData(`${API_BASE}/cities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(formState)
        })
        dataSource.value.push({ ...formState })
        formRef.value.resetFields()
        open.value = false
      })
}
</script>


<style scoped>
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
</style>
