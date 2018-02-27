<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('user.account')" v-model="listQuery.account">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('user.userName')" v-model="listQuery.userName">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" :placeholder="$t('table.status')">
        <el-option v-for="item in statusQueryOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="$t('table.loading')" border stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('user.account')">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('user.userName')">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('user.nickName')">
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.status')">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.operator')">
        <template slot-scope="scope">
          <span>{{scope.row.operator}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.lastModifyTime')">
        <template slot-scope="scope">
          <span>{{scope.row.lastModifyTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">{{$t('table.detail')}}</el-button>
          <el-button v-if="scope.row.status==='0'" size="mini" type="success" @click="handleModifyStatus(scope.row,'1')">{{$t('table.enable')}}
          </el-button>
          <el-button v-if="scope.row.status==='1'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'0')">{{$t('table.disable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('user.account')" prop="account">
          <el-input v-model="temp.account" placeholder="e.g. aihua.tan"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.password')" prop="password">
          <el-input v-model="temp.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.userName')" prop="userName">
          <el-input v-model="temp.userName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.nickName')" prop="nickName">
          <el-input v-model="temp.nickName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.role')">
          <el-select multiple class="filter-item" v-model="temp.roleIds" placeholder="Please select" style="width: 100%">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select"  style="width: 100%">
            <el-option v-for="item in statusAddOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.memo')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.memo">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, createUser, updateUser } from '@/api/user'
  import { roleOptions } from '@/api/role'
  import waves from '@/directive/waves'
  import { parseTime } from '@/utils'
  import appconst from '@/utils/appconst'

  export default {
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          account: undefined,
          userName: undefined,
          status: undefined
        },
        statusQueryOptions: appconst.statusQueryOptions,
        statusAddOptions: appconst.statusAddOptions,
        showReviewer: false,
        temp: {
          id: undefined,
          account: undefined,
          userName: undefined,
          nickName: undefined,
          status: undefined,
          operator: undefined,
          roleIds: [],
          createTime: new Date(),
          lastModifyTime: new Date()
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          account: [{ required: true, message: 'account is required', trigger: 'change' }],
          password: [{ required: true, message: 'password is required', trigger: 'change' }],
          status: [{ required: true, message: 'status is required', trigger: 'change' }]
        },
        downloadLoading: false,
        roleOptions: []
      }
    },
    filters: {
      statusFilter(status) {
        for (const option of appconst.statusQueryOptions) {
          if (option.key === status) {
            return option.display_name
          }
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      parseTime: parseTime,
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      initRoleOptions() {
        roleOptions().then(response => {
          this.roleOptions = response.data.roleOptions
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          account: undefined,
          userName: undefined,
          nickName: undefined,
          status: undefined,
          roleIds: [],
          operator: undefined,
          createTime: new Date(),
          lastModifyTime: new Date()
        }
      },
      handleCreate() {
        debugger
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.initRoleOptions()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createUser(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row)
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateUser(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>
