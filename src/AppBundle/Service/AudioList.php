<?php

namespace AppBundle\Service;

class AudioList
{
    /**
     * @param string $path
     *
     * @return array
     */
    protected function listDir($path) {
        $directories = [];
        $files = scandir($path);

        foreach ($files as $file) {
            if(is_dir($path . '/' . $file) and $file !== "." && $file !== "..") {
                $directories[md5($file)] =  ['dir' => $file];
            }
        }

        return $directories;
    }

    /**
     * @todo parse & store duration
     *
     * @param string $path
     * @param array $filter file extension filter
     *
     * @return array
     */
    protected function listFiles($path, $filter=['mp3', 'wav', 'ogg']) {
        $files = [];
        $pathFiles = scandir($path);

        foreach ($pathFiles as $file) {
            if (!is_file($path . DIRECTORY_SEPARATOR . $file)) { continue; }

            $fileExt =  pathinfo($path . DIRECTORY_SEPARATOR . $file, PATHINFO_EXTENSION);

            if (!in_array($fileExt, $filter)) {
                continue;
            }

            $files[md5($path . $file . rand())] = ['file' => $file, 'duration' => ''];
        }

        return $files;
    }

    /**
     * @param string $path
     * @return array
     */
    public function get($path)
    {
        $path = in_array(mb_substr($path, -1), ['/', '\\']) ? $path : $path . DIRECTORY_SEPARATOR;

        $folders = $this->listDir($path);

        foreach ($folders as &$entry) {
            $entry['files'] = $this->listFiles($path . $entry['dir']);
        }

        return $folders;
    }
}

