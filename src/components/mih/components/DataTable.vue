<template>
  <div class="card" ref="table">
    <div v-show="commandShow" v-if="titleShow" class="table-header">
      <span class="table-title">{{ title }}</span>
      <div v-if="arrowBack" class="actions">
        <div class="btn-group">
          <button class="btn btn-submit text-black" @click="$router.go(-1)">
            <i class="material-icons">arrow_back</i>
          </button>
        </div>
      </div>
    </div>
    <!--    Table Filter-->
    <div v-show="commandShow" class="table-header">
      <div v-if="mode" class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn input-group-text" @click="onView('list')"><i class="material-icons">list</i>
        </button>
        <button type="button" class="btn input-group-text" @click="onView('kanban')"><i
            class="material-icons">grid_view</i></button>
      </div>
      <span v-if="filterMonth">
        <div class="input-group">
            <span class="input-group-text">Month</span>
            <input type="date" v-model="month" @change="onChangeMonth" class="form-control form-control-sm">
      </div>
      </span>
      <span v-if="filterDate" class="mx-2">
        <div class="input-group">
          <span class="input-group-text">Date</span>
          <input type="date" v-model="dateFrom" class="form-control form-control-sm">
          <span class="input-group-text">to</span>
          <input type="date" v-model="dateTo" v-on:change="onChangeDate" v-on:keyup.enter="onChangeDate"
                 class="form-control form-control-sm">
      </div>
      </span>
      <span v-if="filter" class="mx-2">
        <div class="input-group">
          <span class="input-group-text"><i class="material-icons">filter_list</i></span>
          <select class="form-select form-select-sm" v-model="filterBy" v-on:change="onChangeFilter"
                  aria-label="Filter">
            <option selected value="All">All</option>
            <option v-for="item in filterRecord" :value="item.id" :key="item.id">{{ item.desc }}</option>
          </select>
        </div>
      </span>
      <span>
        <div class="input-group" v-if="searching">
          <input id="search-input-container" class="form-control form-control-sm" type="search"
                 v-model="searchInput" placeholder="Input search parameter" @keyup.enter="onEnterSearch">
            <button class="input-group-text" id="addon-wrapping" @click.prevent="onChangeSearch"><i
                class="material-icons">search</i></button>
        </div>
      </span>
      <div class="actions">
        <a v-if="refreshable"
           href="javascript:undefined"
           class="waves-effect btn-flat nopadding mt-2"
           @click.prevent="onRefresh"
        >
          <i class="material-icons">refresh</i>
        </a>
        <a v-if="printable"
           href="javascript:undefined"
           class="waves-effect btn-flat nopadding mt-2"
           @click.prevent="onPrint"
        >
          <i class="material-icons">print</i>
        </a>
        <a v-if="exportable"
           href="javascript:undefined"
           class="waves-effect btn-flat nopadding mt-2"
           @click.prevent="onExportExcel"
        >
          <i class="material-icons">description</i>
        </a>
        <a v-if="uploadButton"
           href="javascript:undefined"
           class="waves-effect btn btn-primary nopadding"
           style="margin-right: 5px;"
           @click.prevent="onUpload"
        >
          {{ uploadButtonTitle }}
        </a>
        <a v-if="createButton"
           href="javascript:undefined"
           class="waves-effect btn btn-primary nopadding"
           @click.prevent="onCreate"
        >
          {{ createButtonTitle }}
        </a>
      </div>
    </div>
    <!--    End Table Filter-->
    <div class="table-responsive">
      <!--    Table Content-->
      <table class="table" ref="table" v-if="columns && list">
        <thead class="thead-light">
        <draggable v-model="columns" :disabled="draggingAble" tag="tr">
          <!--        Dragable-->
          <th v-if="draggingAble" style="width: 10px!important;">
            <i class="material-icons">app_registration</i>
          </th>
          <!--        Number-->
          <th style="width: 5px!important;">No</th>
          <!--        CheckBox-->
          <th v-if="commandCheckbox" style="width: 2px!important;">
            <input class="form-check-input" type="checkbox" id="all" v-model="selectAll"
                   @change="onSelectAll"><span class="m-2">All</span>
          </th>
          <!--        Rows-->
          <th v-for="(column, index) in columns"
              :key="index"
              :class="(sortable && !column.hidden? 'sorting ' : '')
							+ (sortColumn === index ?
								(sortType === 'desc' ? 'sorting-desc' : 'sorting-asc')
								: '')
							+ (column.numeric ? ' numeric' : '')"
              :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}"
              @click="sort(index)"
          >
            <span v-if="!column.hidden">{{ column.label }}</span>
          </th>
          <slot name="thead-tr"/>
        </draggable>
        </thead>
        <draggable
            :list="rows"
            :move="onDragAble"
            ghost-class="ghost"
            tag="tbody">
          <tr v-for="(row, index) in paginated"
              :key="index"
              :class="{ clickable : clickable }"
              @click.prevent="onRowClick(row)"
          >
            <td v-if="draggingAble" style="cursor: move !important;">
              <i class="material-icons">drag_indicator</i>
            </td>
            <td> {{
                currentPerPage * (currentPage - 1) +
                index +
                1
              }}
            </td>
            <td v-if="commandCheckbox">
              <input v-if="row" class="form-check-input" type="checkbox" :value="row"
                     v-model="selected" @change="onSelect(row)"
                     :key="index" id="checkbox">
            </td>
            <td v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}"
            >

              <!--            Normal Content-->
              <span
                  v-if="!column.html && !column.currency && !column.image && column.field !=='active' && !column.badge && !column.hidden"
                  :style="{width: column.width ? 'auto':column.width,display:column.hidden?'none !important;':''}">
              {{ collect(row, column.field) }} <span v-if="column.concat"> {{ collect(row, column.concatWith) }}</span>
            </span>

              <!--            Boolean Content-->
              <div
                  v-if="column.boolean && !column.html && !column.currency && column.field ==='active' && !column.badge && !column.hidden"
                  :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none !important;':''}">
                          <span :class="collect(row, column.field) ? 'badge bg-success' : 'badge bg-secondary'">{{
                              collect(row, column.field) ? column.booleanDesc[0] : column.booleanDesc[1]
                            }}</span>
              </div>

              <!--            Currency Content-->
              <div v-if="!column.html && column.currency"
                   v-html="isCurrency(collect(row, column.field)) && !column.badge && !column.hidden"
                   :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none !important;':''}"/>

              <!--            HTML Content-->
              <div v-if="column.html && !column.hidden" v-html="collect(row, column.field)"
                   :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none !important;':''}"/>

              <!--              Image Content-->
              <div v-if="column.image && !column.hidden"
                   :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none !important;':''}">
                <img v-if="collect(row, column.field)" :src="collect(row, column.field)" class="mih tbl-mih-img"
                     :alt="index"/>
                <avatar v-else :username="collect(row, column.name)" :size="column.size"></avatar>
              </div>

              <!--            Badge Content-->
              <div v-if="column.badge && !column.hidden"
                   :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none !important;':''}">
              <span :class="column.badgeClass? column.badgeClass : 'badge bg-primary'">{{
                  collect(row, column.field)
                }}</span>
              </div>

              <!--        Toogle button-->
              <div v-if="column.buttonToggle && !column.hidden"
                   :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none !important;':''}">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="user-notification-2"
                         :checked="collect(row, column.field)"
                         @click="onCheckToggle(row)"
                         :key="index"
                  >
                  <small>{{
                      collect(row, column.field) ? column.buttonToggleDesc[0] : column.buttonToggleDesc[1]
                    }}</small>
                </div>
              </div>

            </td>
            <slot name="tbody-tr" :row="row"/>
          </tr>
          <tr v-if="rows.length === 0">
            <td class="text-center" :colspan="columns.length+1">Oops..! No records found</td>
          </tr>
        </draggable>
      </table>
      <!--    End Table Content-->

      <!--    Kanban Content-->
      <div v-else class="box">
        <div v-if="kanban" class="row">
          <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12"
               v-for="(row, index) in paginated"
               :key="index"
               :class="{ clickable : clickable }"
          >
            <div class="box-part text-center">
              <div v-for="(column, columnIndex) in columnsKanban"
                   :key="columnIndex"
                   :class="{ numeric : column.numeric }">

                <!--            Normal Content-->
                <div class="kanban-text"
                     v-if="!column.html && !column.currency && !column.image && column.field !=='active' && !column.badge && !column.hidden && !column.email"
                     :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}">
                  {{ collect(row, column.field) }} <span v-if="column.concat"> {{
                    collect(row, column.concatWith)
                  }}</span>
                </div>
                <!--            Boolean Content-->
                <div
                    v-if="!column.html && !column.currency && column.field ==='active' && !column.badge && !column.hidden && !column.email"
                    :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}">
                          <span :class="collect(row, column.field) ? 'badge bg-success' : 'badge bg-secondary'">{{
                              collect(row, column.field) ? 'Active' : 'Non Active'
                            }}</span>
                </div>
                <!--              Image Content-->
                <div v-if="column.image && !column.hidden && !column.email"
                     :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}">
                  <img v-if="collect(row, column.field)" :src="collect(row, column.field)" class="mih kanban-mih-img"
                       :alt="index"/>
                  <i v-else class="material-icons">photo</i>
                </div>
                <!--            Badge Content-->
                <div v-if="column.badge && !column.hidden && !column.email"
                     :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}">
              <span :class="column.badgeClass? column.badgeClass : 'badge bg-primary'">{{
                  collect(row, column.field)
                }}</span>
                </div>

                <!--              Mail Content-->
                <div v-if="column.email && !column.hidden"
                     :style="{width: column.width ? column.width : 'auto',display:column.hidden?'none':''}">
                  <a :href="'mailto:'+collect(row, column.field)" class="kanban-a">{{ collect(row, column.field) }}</a>
                </div>
              </div>
              <a @click.prevent="onRowClick(row)" class="kanban-a align-text-bottom">View More</a>
            </div>
          </div>
        </div>
      </div>
      <!--    End Content-->
    </div>

    <!--    Table Footer-->
    <div v-if="paginate" class="table-footer">
      <div class="d-flex justify-content-start mt-2">
        <label><span>{{ lang['total_record'] }} : {{ totalRecords }} </span></label>
      </div>
      <div :class="{'datatable-length': true, 'rtl': lang.__is_rtl}">
        <label class="mt-2 px-4">
          <span> {{ lang['rows_per_page'] }}:</span>
          <select class="browser-default" v-model="limit" @change="onChangeRowPage">
            <option v-for="(option, index) in rowsPerPage"
                    :key="index"
                    :value="option"
                    :selected="option === currentPerPage"
            >
              {{ option === -1 ? lang['10'] : option }}
            </option>
          </select>
        </label>
      </div>
      <div :class="{'datatable-info': true, 'rtl': lang.__is_rtl}">
				<span>
          {{ currentPage }}
				</span>
        <span>
					{{ lang['out_of_pages'] }}
				</span>
        <span>
					{{ lastPage }}
				</span>
      </div>
      <div>
        <ul class="pagination justify-content-center material-pagination mt-2">
          <li>
            <a href="javascript:undefined"
               class="waves-effect btn-flat"
               tabindex="0"
               @click.prevent="onPreviousPage"
            >
              <i class="material-icons">chevron_left</i>
            </a>
          </li>
          <li>
            <a href="javascript:undefined"
               class="waves-effect btn-flat"
               tabindex="0"
               @click.prevent="onNextPage"
            >
              <i class="material-icons">chevron_right</i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!--    End Table Footer-->
  </div>
</template>

<script>
import Fuse from 'fuse.js';
import locales from '../index';
import Utils from "../../../helpers/Util";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
import draggable from 'vuedraggable'
import avatar from 'vue-avatar'

export default {
  components: {
    draggable,
    avatar
  },

  props: {
    mode: {
      type: Boolean,
      required: false,
      default: false,
    },

    list: {
      type: Boolean,
      required: false,
      default: true,
    },

    kanban: {
      type: Boolean,
      required: false,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    titleShow: {
      type: Boolean,
      required: false,
      default: true,
    },

    arrowBack: {
      type: Boolean,
      required: false,
      default: true,
    },

    commandCheckbox: {
      type: Boolean,
      required: false,
      default: false,
    },

    commandShow: {
      type: Boolean,
      required: false,
      default: true,
    },

    columns: {
      type: Array,
      required: false,
    },

    columnsKanban: {
      type: Array,
      required: false,
    },

    rows: {
      type: Array,
      required: false,
    },

    clickable: {
      type: Boolean,
      required: false,
      default: true,
    },

    searching: {
      type: Boolean,
      required: false,
      default: true,
    },

    customButtons: {
      type: Array,
      required: false,
      default: () => [],
    },

    rowsPerPage: {
      type: Array,
      required: false,
      default: () => [5, 10, 50, 100, 500, 1000, 5000, 10000],
    },

    defaultPerPage: {
      type: Number,
      required: false,
      default: 10,
    },

    currentPage: {
      type: Number,
      required: false,
      default: 1,
    },

    lastPage: {
      type: Number,
      required: false,
      default: 1,
    },

    currentPerPage: {
      type: Number,
      required: false,
      default: 10,
    },

    prevPageUrl: {
      type: String,
      required: false,
      default: null,
    },

    nextPageUrl: {
      type: String,
      required: false,
      default: null,
    },

    totalRecords: {
      type: Number,
      required: false,
      default: 0,
    },

    sortable: {
      type: Boolean,
      required: false,
      default: true,
    },

    searchable: {
      type: Boolean,
      required: false,
      default: true,
    },

    exactSearch: {
      type: Boolean,
      required: false,
      default: false,
    },

    filter: {
      type: Boolean,
      required: false,
      default: false,
    },

    filterRecord: {
      type: Array,
      required: false,
      default: () => [{'id': 'id', "desc": "ID"}, {'id': 'status', "desc": "Status"}],
    },

    serverSearch: {
      type: Boolean,
      required: false,
      default: false,
    },

    serverSearchFunc: {
      type: Function,
      required: false,
      default: () => {
      },
    },

    paginate: {
      type: Boolean,
      required: false,
      default: true,
    },

    exportable: {
      type: Boolean,
      required: false,
      default: false,
    },

    printable: {
      type: Boolean,
      required: false,
      default: false,
    },

    locale: {
      type: String,
      required: false,
      default: 'en',
    },

    initSortCol: {
      type: Number,
      required: false,
      default: -1,
    },

    loadingAnimation: {
      type: Boolean,
      required: false,
      default: false,
    },

    createButton: {
      type: Boolean,
      required: false,
      default: false,
    },

    createButtonTitle: {
      type: String,
      required: false,
      default: 'Create New',
    },

    uploadButton: {
      type: Boolean,
      required: false,
      default: false,
    },

    uploadButtonTitle: {
      type: String,
      required: false,
      default: 'Uplaod Data',
    },

    filterDate: {
      type: Boolean,
      required: false,
      default: false
    },

    refreshable: {
      type: Boolean,
      required: false,
      default: false
    },

    pdfOrientation: {
      type: String,
      required: false,
      default: 'landscape',
    },

    pdfFormat: {
      type: String,
      required: false,
      default: 'a3',
    },

    draggingAble: {
      type: Boolean,
      required: false,
      default: false,
    },

    filterMonth: {
      type: Boolean,
      required: false,
      default: false
    },

  },
  data: () => ({
    dateFrom: '',
    dateTo: '',
    filterBy: 'id',
    filterParam: '',
    limit: 10,
    sortColumn: -1,
    sortType: 'asc',
    searchInput: '',
    dragging: false,
    month: '',
    selected: [],
    selectAll: false
  }),

  methods: {
    /**
     * On View Table Mode
     */
    onView(mode) {
      this.list = mode === 'list';
    },

    /**
     * On Dragable
     */
    onDragAble() {
      this.$emit("onDragAble", this.draggingRows)
    },

    /**
     * On Create
     */
    onCreate() {
      this.$emit("onCreate")
    },

    /**
     * On Create Toggle Button
     */
    onCheckToggle(props) {
      this.$emit("onCheckToggle", props)
    },

    /**
     * Checkbox All
     */
    onSelectAll() {
      this.selected = [];
      if (this.selectAll) {
        for (let i in this.rows) {
          this.selected.push(this.rows[i]);
        }
      }
      this.$emit("onSelectAll", this.selected)
    },
    /**
     * Checkbox
     */
    onSelect() {
      this.$emit("onSelect", this.selected)
    },

    /**
     * On Upload
     */
    onUpload() {
      this.$emit("onUpload")
    },

    /**
     * On Refresh
     */
    onRefresh() {
      this.$emit("onRefresh", [this.filterBy, this.limit, this.currentPage])
    },

    /**
     * On Change Filter By
     */
    onChangeFilter() {
      this.$emit("onChangeFilter", [this.filterBy, this.limit, this.currentPage])
    },

    /**
     * On Chane Month
     */
    onChangeMonth() {
      this.$emit("onChangeMonth", this.month)
    },

    /**
     * On Change Date
     */
    onChangeDate() {
      if (this.dateFrom < this.dateTo) {
        this.$emit("onChangeDate", [this.dateFrom, this.dateTo])
      } else {
        alert('Invalid date !')
      }
    },

    /**
     * On Change Search
     */
    onChangeSearch() {
      if (this.dateFrom < this.dateTo) {
        this.$emit("onChangeSearch", [this.searchInput, this.limit, this.currentPage])
      } else {
        alert('Invalid date !')
      }
    },

    /**
     * On Enter Search
     */
    onEnterSearch() {
      if (this.dateFrom < this.dateTo) {
        this.$emit("onEnterSearch", [this.searchInput, this.limit, this.currentPage])
      } else {
        alert('Invalid date !')
      }
    },

    /**
     * On Next Page
     */
    onNextPage() {
      if (this.nextPageUrl) {
        ++this.currentPage;
        this.$emit("onNextPage", [this.limit, this.currentPage])
      }
    },

    /**
     * On Prev Page
     */
    onPreviousPage() {
      if (this.prevPageUrl) {
        this.currentPage--;
        this.$emit("onPreviousPage", [this.limit, this.currentPage])
      }
    },

    /**
     * On Change Perpage
     */
    onChangeRowPage(e) {
      this.currentPerPage = parseInt(e.target.value);
      this.$emit("onChangeRowPage", [this.limit, this.currentPage])
    },

    /**
     * On Change Currency
     */
    isCurrency(value) {
      return Utils.currencyRp(value);
    },

    /**
     * Sorting
     */
    sort(index) {
      if (!this.sortable)
        return;
      if (this.sortColumn === index) {
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortType = 'asc';
        this.sortColumn = index;
      }
    },

    /**
     * On Row Click
     */
    onRowClick(row) {
      if (!this.clickable) {
        return;
      }
      if (getSelection().toString()) {
        return;
      }
      this.$emit('onRowClick', row);
    },

    /**
     * On Export to excel
     */
    onExportExcel() {
      const mimeType = 'data:application/vnd.ms-excel';
      const html = this.renderTable().replace(/ /g, '%20');

      // eslint-disable-next-line eqeqeq
      const documentPrefix = this.title != '' ? this.title.replace(/ /g, '-') : 'Sheet';
      const d = new Date();

      const dummy = document.createElement('a');
      dummy.href = mimeType + ', ' + html;
      dummy.download = documentPrefix
          + '-' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()
          + '.xls';
      document.body.appendChild(dummy);
      dummy.click();
    },

    /**
     * On Print to PDF
     */
    onPrint() {
      const pdf = new jsPDF({
        orientation: this.pdfOrientation,
        format: this.format,
        precision: 2
      });

      pdf.setFontSize(20);
      pdf.text(this.title, 15, 10);
      pdf.setFontSize(7);

      const column = [];
      column.push('No');
      const data = [];
      for (let index in this.columns) {
        column.push(this.columns[index].label);
      }

      for (let key in this.rows) {
        let rows = [];
        rows.push(parseInt(key) + 1);
        for (let index in this.columns) {
          rows.push(this.collect(this.rows[key], this.columns[index].field));
        }
        data.push(rows);
      }

      const head = [column];

      autoTable(pdf, {
        head: head,
        body: data
      });

      pdf.save(this.title + '_' + new Date().getTime() + '.pdf')
    },

    renderTable() {
      let table = '<table><thead>';

      table += '<tr>';
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        table += '<th>';
        table += column.label;
        table += '</th>';
      }
      table += '</tr>';

      table += '</thead><tbody>';

      for (let i = 0; i < this.rows.length; i++) {
        const row = this.rows[i];
        table += '<tr>';
        for (let j = 0; j < this.columns.length; j++) {
          const column = this.columns[j];
          table += '<td>';
          table += this.collect(row, column.field);
          table += '</td>';
        }
        table += '</tr>';
      }

      table += '</tbody></table>';

      return table;
    },

    dig(obj, selector) {
      let result = obj;
      const splitter = selector.split('.');

      for (let i = 0; i < splitter.length; i++) {
        if (result == undefined)
          return undefined;

        result = result[splitter[i]];
      }

      return result;
    },

    collect(obj, field) {
      if (typeof (field) === 'function')
        return field(obj);
      else if (typeof (field) === 'string')
        return this.dig(obj, field);
      else
        return undefined;
    },

    synchronizeCssStyles(src, destination, recursively) {
      destination.style.cssText = this.getComputedStyleCssText(src);

      if (recursively) {
        const vSrcElements = src.getElementsByTagName('*');
        const vDstElements = destination.getElementsByTagName('*');

        for (var i = vSrcElements.length; i--;) {
          const vSrcElement = vSrcElements[i];
          const vDstElement = vDstElements[i];
          vDstElement.style.cssText = this.getComputedStyleCssText(vSrcElement);
        }
      }
    },

    getComputedStyleCssText(element) {
      const cssObject = window.getComputedStyle(element);
      const cssAccumulator = [];

      if (cssObject.cssText !== '') {
        return cssObject.cssText;
      }

      for (let prop in cssObject) {
        if (typeof cssObject[prop] === 'string') {
          cssAccumulator.push(prop + ' : ' + cssObject[prop]);
        }
      }

      return cssAccumulator.join('; ');
    },
  },

  watch: {
    perPageOptions(newOptions) {
      // If defaultPerPage is provided and it's a valid option, set as current per page
      if (newOptions.indexOf(this.defaultPerPage) > -1) {
        this.currentPerPage = parseInt(this.defaultPerPage);
      } else {
        // Set current page to first value
        this.currentPerPage = newOptions[0];
      }
    },

    searchInput(newSearchInput) {
      if (this.searching && this.serverSearch && this.serverSearchFunc)
        this.serverSearchFunc(newSearchInput);
    },

    rows(newRows, oldRows) {
      // If the number of rows change, password the currentPage to 1
      if (newRows !== oldRows)
        this.currentPage = 1;
    },
  },

  computed: {
    processedRows() {
      let computedRows = this.rows;
      if (this.sortable !== false)
        computedRows = computedRows.sort((x, y) => {
          if (!this.columns[this.sortColumn])
            return 0;
          const cook = x => {
            x = this.collect(x, this.columns[this.sortColumn].field);
            if (typeof (x) === 'string') {
              x = x.toLowerCase();
              if (this.columns[this.sortColumn].numeric)
                x = x.indexOf('.') >= 0 ? parseFloat(x) : parseInt(x);
            }
            return x;
          };

          x = cook(x);
          y = cook(y);

          return (x < y ? -1 : (x > y ? 1 : 0)) * (this.sortType === 'desc' ? -1 : 1);
        });

      if (this.searching && !this.serverSearch && this.searchInput) {
        const searchConfig = {keys: this.columns.map(c => c.field)};

        // Enable searching of numbers (non-string)
        searchConfig.getFn = (obj, path) => {
          const property = this.dig(obj, path);
          if (Number.isInteger(property))
            return JSON.stringify(property);
          return property;
        };

        if (this.exactSearch) {
          //return only exact matches
          searchConfig.threshold = 0,
              searchConfig.distance = 0;
        }

        computedRows = (new Fuse(computedRows, searchConfig)).search(this.searchInput);
      }

      return computedRows;
    },
    paginated() {
      let paginatedRows = this.processedRows;
      // if (this.paginate && this.currentPerPage !== -1)
      //   paginatedRows = paginatedRows.slice(
      //       (this.currentPage - 1) * this.currentPerPage,
      //       this.currentPerPage === -1 ? paginatedRows.length + 1 : this.currentPage * this.currentPerPage
      //   );
      return paginatedRows;
    },

    lang() {
      return this.locale in locales ? locales[this.locale] : locales['en'];
    },

    draggingRows() {
      return this.rows;
    }
  },

  mounted() {
    if (!(this.locale in locales))
      console.error(`vue-materialize-datable: Invalid locale '${this.locale}'`);
    this.sortColumn = this.initSortCol;
  },

  created() {
    this.dateTo = new Date().toISOString().substr(0, 10);
    let d = new Date(this.dateTo);
    d.setDate(d.getDate() - 1);
    this.dateFrom = new Date(d).toISOString().substr(0, 10);
    this.month = new Date().toISOString().substr(0, 10);
    this.kanban && this.mode ? this.list = false : this.list;
  },
};
</script>

<style scoped>
tr.clickable {
  cursor: pointer;
}

#search-input-container {
  padding: 0 14px 0 24px;
  border-bottom: solid 1px #DDDDDD;
}

.table-header {
  height: 64px;
  padding-left: 24px;
  padding-right: 14px;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: flex;
  border-bottom: solid 1px #DDDDDD;
}

.table-header .actions {
  display: -webkit-flex;
  margin-left: auto;
}

.table-header .btn-flat {
  min-width: 36px;
  padding: 0 8px;
}

.table-header input {
  margin: 0;
  height: auto;
}

.table-header i {
  color: rgba(0, 0, 0, 0.54);
  font-size: 20px;
}

.table-footer {
  height: 56px;
  padding-left: 24px;
  padding-right: 14px;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -webkit-align-items: center;
  align-items: center;
  font-size: 12px !important;
  color: rgba(0, 0, 0, 0.54);
}

.table-footer .datatable-length {
  display: -webkit-flex;
  display: flex;
}

.table-footer .datatable-length select {
  outline: none;
}

.table-footer label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  /* works with row or column */

  flex-direction: row;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.table-footer .select-wrapper {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  /* works with row or column */

  flex-direction: row;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.table-footer .datatable-info,
.table-footer .datatable-length {
  margin-right: 32px;
}

.table-footer .material-pagination {
  display: flex;
  -webkit-display: flex;
  margin: 0;
}

.table-footer .material-pagination li a {
  color: rgba(0, 0, 0, 0.54);
  padding: 0 8px;
  font-size: 24px;
}

.table-footer .select-wrapper input.select-dropdown {
  margin: 0;
  border-bottom: none;
  height: auto;
  line-height: normal;
  font-size: 12px;
  width: 40px;
  text-align: right;
}

.table-footer select {
  background-color: transparent;
  width: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  height: auto;
  margin-left: 20px;
}

.table-title {
  font-size: 20px;
  color: #000;
}

table tr td {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: solid 1px #DDDDDD;
  overflow: hidden;
  text-overflow: ellipsis;
}

table td, table th {
  border-radius: 0;
}

table tr td a {
  color: inherit;
}

table tr td a i {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.54);
}

table tbody tr {
  font-size: 12px;
  white-space: nowrap;
  vertical-align: middle;
}

table th {
  font-size: 12px;
  font-weight: 500;
  color: #757575;
  cursor: pointer;
  white-space: nowrap;
  height: 30px;
  vertical-align: middle;
  outline: none !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

table th:hover {
  overflow: visible;
  text-overflow: initial;
}

table th.sorting-asc,
table th.sorting-desc {
  color: rgba(0, 0, 0, 0.87);
}

table th.sorting:after,
table th.sorting-asc:after {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 16px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  word-wrap: normal;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  content: "arrow_back";
  -webkit-transform: rotate(90deg);
  display: none;
  vertical-align: middle;
}

table th.sorting:hover:after,
table th.sorting-asc:after,
table th.sorting-desc:after {
  display: inline-block;
}

table th.sorting-desc:after {
  content: "arrow_forward";
}

table tbody tr:hover {
  background-color: #EEE;
}

table th:last-child,
table td:last-child {
  padding-right: 14px;
}

table th:first-child, table td:first-child {
  padding-left: 24px;
}

.rtl {
  direction: rtl;
}

/**
 Tbl IMG
 */

.tbl-mih-img {
  border: solid 1px #F2F2F2;
  border-radius: 5px 10px 5px;
  margin: 2px;
  max-width: 40px;
  background-color: #F2F2F2;
  display: block;
  width: auto;
  height: auto;
}

/**
  Kanban Card
 */
.kanban-mih-img {
  border: solid 1px #F2F2F2;
  border-radius: 5px 20px 5px;
  margin: 2px;
  max-width: 100px;
  width: auto;
  height: auto;
  background-color: #F2F2F2;
}

.box {
  background: #F2F2F2 !important;
  padding: 0px 10px;
}

.box-part {
  background: #FFF;
  border-radius: 10px;
  padding: 10px 10px;
  margin: 12px 0px;
  max-height: 500px;
  min-height: 270px;
}

.kanban-text {
  margin: 1px 0px;
}

.kanban-a {
  color: #0F75BC;
  font-size: 13px;
  margin-top: 10px;
}
</style>
