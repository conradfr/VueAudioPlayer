import Vue from 'vue';
import Vuex from 'vuex';

import APlayer from 'aplayer'

var VueCookie = require('vue-cookie');

Vue.use(Vuex);
Vue.use(VueCookie);

/* ----- CONFIG ----- */

const FOLDER_PATH = 'media/';
const DEFAULT_SORT = 'asc';
const PIC_PATH = 'img/cover.png';

/* ----- STORE ----- */

const store = new Vuex.Store({
    state: {
        folderList: appData,
        folderSelected: null,
        playlist: [],
        currentTrackIndex: null
    },
    getters: {
        songs: state => {
            return state.playlist.map(function(track) {
                return {
                    title: state.folderList[track.dir].files[track.id].file,
                    url: `${FOLDER_PATH}${state.folderList[track.dir].dir}/${state.folderList[track.dir].files[track.id].file}`,
                    author: state.folderList[track.dir].dir,
                    pic: PIC_PATH
                }
            })
        }
    },
    mutations: {
        folderSelect (state, folderId) {
            state.folderSelected = folderId;
        },
        folderSet (state, folderId) {
            const tracksIds = Object.keys(state.folderList[folderId].files);

            state.playlist = tracksIds.map(function(trackId) {
                return {
                    id: trackId,
                    dir: folderId
                }
            });
        },
        playAll (state) {
            const playlist = [];
            const folderIds = Object.keys(state.folderList);

            folderIds.forEach(function(folderId) {
                Object.keys(state.folderList[folderId].files).forEach(function (trackId) {
                    playlist.push({id: trackId, dir: folderId});
                });
            });

            state.playlist = playlist;
        },
        playlistSet (state, tracks) {
            state.playlist = tracks.map(function(track) {
                return {
                    id: track.id,
                    dir: track.dir
                }
            });
        }
    },
    actions: {
        playAll: ({commit}) => {
            commit('playAll');
        },
        folderSelect: ({commit}, folderId) => {
            commit('folderSelect', folderId);
        },
        folderPlay: ({context, commit}, folderId) => {
            commit('folderSet', folderId);
        },
        trackPlay: ({commit}, {folderId, trackId}) => {
            commit('playlistSet', [{dir: folderId, id: trackId}]);
        }
    }
});

/* ----- COMPONENTS ----- */

// FolderList
const repFolderList = Vue.component('repFolderList', {
    template: '#repFolderListTpl',
    data() {
        return {
            sort: this.$cookie.get('rep_sort') || DEFAULT_SORT
        }
    },
    computed: Vuex.mapState({
        folders (state) {
            if (this.sort == 'asc') { return state.folderList; }

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
            const newSort = this.sort == 'asc' ? 'desc' : 'asc';

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
});

const repTrackList = Vue.component('repTrackList', {
    template: '#repTrackListTpl',
    computed: Vuex.mapState({
        folder: state => state.folderSelected === null ? null : state.folderList[state.folderSelected],
        folderSelected: state => state.folderSelected
    }),
    methods: {
        folderPlay: function (folderId) {
            this.$store.dispatch('folderPlay', folderId);
        },
        trackPlay: function (folderId, trackId) {
            this.$store.dispatch('trackPlay', {folderId, trackId});
        }
    }
});

// Player
const repPlayer = Vue.component('repPlayer', {
    template: '#repPlayerTpl',
    data() {
        return {
            control: null
        }
    },
    computed: Vuex.mapState({
        songs () {
            return this.$store.getters.songs
        },
        folderSelected: state => state.folderSelected
    }),
    watch: {
        songs: function (val, oldVal) {
            if (this.control != null) {
                this.control.destroy();
            }

            if (val.length === 0 ) { return; }

            let player = this.control = new APlayer({
                mode: 'order',
                music: val
            });

            player.play();
        },
    }
});

/* ----- APP ----- */

const app = new Vue({
    el: '#app',
    store,
    components: {
        'rep-folder-list': repFolderList,
        'rep-track-list': repTrackList,
        'rep-player': repPlayer
    }
});



