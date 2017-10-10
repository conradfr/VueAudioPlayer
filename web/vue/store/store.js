import Vue from 'vue';
import Vuex from 'vuex';

import * as config from '../config/config.js';

Vue.use(Vuex);

const queryString = require('query-string');
const parsed = queryString.parse(location.search);

const initialFolder = () => {
    if (typeof parsed.f !== 'undefined' && typeof appData[parsed.f] !== 'undefined') {
        return parsed.f
    }
    return null;
};

const store = new Vuex.Store({
    state: {
        folderList: appData,
        folderSelected: initialFolder(),
        playlist: [],
        currentTrackIndex: null
    },
    getters: {
        songs: state => {
            return state.playlist.map(function(track) {
                return {
                    title: state.folderList[track.dir].files[track.id].file,
                    url: `${config.FOLDER_PATH}${state.folderList[track.dir].dir}/${state.folderList[track.dir].files[track.id].file}`,
                    author: state.folderList[track.dir].dir,
                    pic: config.PIC_PATH
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

// track play ?
if (typeof parsed.t !== 'undefined') {
    if (store.state.folderSelected !== null) {
        if (typeof store.state.folderList[store.state.folderSelected]['files'][parsed.t] !== 'undefined') {
            const folderId = store.state.folderSelected;
            const trackId = parsed.t;
            Vue.nextTick(() => {
                store.dispatch('trackPlay', {folderId, trackId});
            });
        }
    }
}

export default store;
