<?php

namespace AppBundle\Controller;

use AppBundle\Service\AudioList;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(AudioList $audioListService, Request $request) {
        $exportDir = $this->getParameter('media_folder');
        $audioList = $audioListService->get($exportDir);

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'folders' => $audioList,
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }
}
