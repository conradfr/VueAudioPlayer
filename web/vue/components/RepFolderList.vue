<template>
    <table class="table table-striped table-condensed table-hover">
        <thead>
        <tr>
            <th class="folder-name clickable" v-on:click="toggleSort()" width="55%">Folders
                <span v-bind:class="{caret: true, 'caret-up': sort == 'asc'}"></span>
            </th>
            <th width="10%" class="text-center">{{ Object.keys(folders).length }}</th>
            <th width="35%" class="text-right">
                <button type="button" class="btn btn-default btn-xs" v-if="folders" v-on:click="playAll()">
                    <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> Play all</button>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(entry, key) in folders" v-bind:class="{ 'bg-primary': key == folderSelected }">
            <td class="clickable folder-name" v-on:click="folderView(key)">{{ entry.dir }}</td>
            <td class="clickable text-center" v-on:click="folderView(key)">{{ Object.keys(entry.files).length }}</td>
            <td class="text-right">
                <button type="button" class="btn btn-default btn-xs hidden-xs" v-on:click="folderView(key)">
                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> See</button>
                <button type="button" class="btn btn-default btn-xs" v-on:click="folderPlay(key)">
                    <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> Play</button>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import { mapState } from 'vuex'

import { DEFAULT_SORT } from '../config/config.js';

export default {
    data() {
        return {
            sort: this.$cookie.get('rep_sort') || DEFAULT_SORT
        }
    },
    computed: mapState({
        folders (state) {
            if (this.sort === 'asc') { return state.folderList; }

            const descOrder = Object.keys(state.folderList).reverse();
            const folderSorted = {};

            descOrder.forEach(function(folder) {
                folderSorted[folder] = {
                    dir: state.folderList[folder].dir,
                    files: state.folderList[folder].files
                };
            });

            return folderSorted;
        },
        folderSelected: state => state.folderSelected
    }),
    methods: {
        toggleSort: function () {
            const newSort = this.sort === 'asc' ? 'desc' : 'asc';

            this.$cookie.set('rep_sort', newSort, 365);
            this.sort = newSort;
        },
        folderView: function (folderId) {
            this.$store.dispatch('folderSelect', folderId);
        },
        folderPlay: function (folderId) {
            this.$store.dispatch('folderPlay', folderId);
        },
        playAll: function () {
            this.$store.dispatch('playAll');
        }
    }
}
</script>
