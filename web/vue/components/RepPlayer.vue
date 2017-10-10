<template>
    <div class="audio-player">
        <h5 v-bind:class="{ bumpit: folderSelected }">Player</h5>
        <div id="player1" ref="player1" class="aplayer"></div>
        <!--<a-player v-if="songs.length > 0" :music="songs" ref="player"></a-player>-->
    </div>
</template>

<script>
import APlayer from 'aplayer'

import { mapState } from 'vuex'

export default {
    data() {
        return {
            control: null
        }
    },
    computed: mapState({
        songs () {
            return this.$store.getters.songs
        },
        folderSelected: state => state.folderSelected
    }),
    watch: {
        songs: function (val, oldVal) {
            if (this.control !== null) {
                this.control.destroy();
            }

            if (val.length === 0 ) { return; }

            let player = this.control = new APlayer({
                mode: 'order',
                music: val,
                preload: 'auto'
            });

            player.play();
        }
    }
}
</script>
