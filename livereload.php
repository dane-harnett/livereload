<?php
if($_POST['filestowatch']){
    $files = $_POST['filestowatch'];
    $return = array();
    $return['files'] = array();
    $return['reload'] = false;
    foreach($files as $file){
        $time = getFileTime($file['src']);
        if($file['mod']){ 
            if($time != $file['mod'] && $time){
                $return['reload'] = true;
            }
        }
        $return['files'][] = array('src' => $file['src'], 'mod' => $time, 'media'=>$file['media']);

    }
    echo json_encode($return);
}

function getFileTime($src){
    $base = getcwd();
    $folder = dirname(str_replace('http://'.$_SERVER['HTTP_HOST'],'',$_POST['base']));
    if(file_exists($base.$folder.'/'.$src)){
        return filemtime($base.$folder.'/'.$src);
    }else if(file_exists($base.$src)){
        return filemtime($base.$src);
    } 
    return 0;
}
?>