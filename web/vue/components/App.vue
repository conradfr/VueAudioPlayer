<template>
    <div class="row" id="app">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 app-panel">
            <div class="folder-panel">
                <rep-folder-list></rep-folder-list>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-offset-4 col-lg-4 app-panel">
            <rep-track-list></rep-track-list>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-md-push-6 col-lg-offset-8 col-lg-4 app-panel">
            <div class="center-block">
                <rep-player></rep-player>
            </div>
        </div>
    </div>
</template>

<script>
import RepFolderList from './RepFolderList.vue'
import RepTrackList from './RepTrackList.vue'
import RepPlayer from './RepPlayer.vue'

export default {
    components: {
        RepFolderList,
        RepTrackList,
        RepPlayer
    }
}
</script>
