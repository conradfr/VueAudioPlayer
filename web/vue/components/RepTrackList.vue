<template>
    <div>
        <table class="table table-striped table-condensed table-hover">
            <thead>
            <tr>
                <th class="folder-name" width="70%">Files</th>
                <th width="30%" class="text-right">
                    <transition name="fadecopy">
                        <span v-if="folderSelected && linkCopy === folder.dir" class="icon-copy glyphicon glyphicon-ok" aria-hidden="true"></span>
                    </transition>
                    <button type="button" class="btn btn-default btn-xs" v-if="folderSelected && Object.keys(folder.files).length > 0"
                            v-clipboard="copyFolderAction" :key="folder.dir" @success="handleSuccess(folder.dir)" title="Copy link to clipboard">
                        <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
                    </button>

                    <button type="button" class="btn btn-default btn-xs" v-if="folderSelected && Object.keys(folder.files).length > 0" v-on:click="folderPlay(folderSelected)">
                        <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> Play all</button>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="folder == null">
                <td colspan="2" class="text-center">Choose a folder</td>
            </tr>
            <tr v-else-if="Object.keys(folder.files).length == 0">
                <td colspan="2" class="text-center">No files in this folder !</td>
            </tr>
            <tr v-else v-for="(entry, key) in folder.files" v-on:click="trackPlay(folderSelected, key)">
                <td class="folder-name clickable" >{{ entry.file }}</td>
                <td class="text-right clickable">
                    <transition name="fadecopy">
                        <span v-if="folderSelected && linkCopy === key" class="icon-copy glyphicon glyphicon-ok" aria-hidden="true"></span>
                    </transition>
                    <button type="button" class="btn btn-default btn-xs" v-if="folderSelected && Object.keys(folder.files).length > 0"
                            v-on:click.stop="" v-clipboard="copyAction(key)" :key="key" @success="handleSuccess(key)" title="Copy link to clipboard">
                        <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
                    </button>

                    <button type="button" class="btn btn-default btn-xs" v-on:click.stop="trackPlay(folderSelected, key)">
                        <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> Play</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            linkCopy: null
        }
    },
    computed: mapState({
        folder: state => state.folderSelected === null ? null : state.folderList[state.folderSelected],
        folderSelected: state => state.folderSelected
    }),
    methods: {
        folderPlay: function (folderId) {
            this.$store.dispatch('folderPlay', folderId);
        },
        trackPlay: function (folderId, trackId) {
            this.$store.dispatch('trackPlay', {folderId, trackId});
        },
        copyFolderAction() {
            return `${baseUrl}?f=${this.folderSelected}`;
        },
        copyAction(key) {
            return `${baseUrl}?f=${this.folderSelected}&t=${key}`;
        },
        handleSuccess(e) {
            this.$data.linkCopy = e;
            window.setTimeout(() => {
                this.$data.linkCopy = null;
            }, 2000);
        }
    }
}
</script>
