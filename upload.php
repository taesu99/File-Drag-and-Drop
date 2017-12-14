<?php
	header('Content-type: application/json');
	session_start();
	
	if(isset($_POST['extension'])){
		$log = fopen('transferlog.txt','a');
		fwrite($log,"Try to upload file with wrong filetype: ".$_POST['extension']." on ".date("m/d/Y h:i:sa")."\n");
		fclose($log);
		$response_array['status'] = 'error';
		echo json_encode($response_array);
	}
	
	if(isset($_POST['old'])){
		$olddirectory = htmlspecialchars($_POST['old']);
		$_SESSION['old'] = $olddirectory;
		echo json_encode($olddirectory);
	}
	
	if(isset($_POST['new'])){
		$newdirectory = htmlspecialchars($_POST['new']);
		$_SESSION['new'] = $newdirectory; 
		echo json_encode($newdirectory);
	
	}
	if(isset($_FILES['file']['name'][0])){
		//echo "success";
		/*
		$dir_separator = DIRECTORY_SEPARATOR;
		$folder = "images";
		$destination_path = dirname(__FILE__).$dir_separator.$folder.$dir_separator;
	
		$target_path = $destination_path.$_FILES['file']['name'];
		*/
		foreach($_FILES['file']['name'] as $keys =>$values){
			$name = $_FILES['file']['name'][$keys];
			$temp = $_FILES['file']['tmp_name'][$keys];
			$error = $_FILES['file']['error'][$keys];
			$size = $_FILES['file']['size'][$keys];
			//echo $_SESSION['new'];
			//echo $name;
			$target_path = $_SESSION['new'].$name;
			$old_path = $_SESSION['old'].$name;
			//echo $old_path;
			$file_extension = pathinfo($name);
			$extension_array=array('jpg','png','gif');
			//recode to elseif statement to avoid too many nested if statement
			if ($error !== UPLOAD_ERR_OK){
				//check error message
				$log = fopen('transferlog.txt','a');
				fwrite($log,"There is error on the file ".date("m/d/Y h:i:sa")."\n");
				fclose($log);
				$response_array['status'] = 'error';
			}elseif($size > 1000000){
				//check file size, set at 1 mb
				$log = fopen('transferlog.txt','a');
				fwrite($log,"File is too large to move ".date("m/d/Y h:i:sa")."\n");
				fclose($log);
				$response_array['status'] = 'error';
			}elseif(in_array($file_extension['extension'],$extension_array)==false){
				//check file type if front end fails
				$log = fopen('transferlog.txt','a');
				fwrite($log,"Server detect non-compliant file on ".date("m/d/Y h:i:sa")."\n");
				fclose($log);
				$response_array['status'] = 'error';
			}elseif(is_dir($_SESSION['new']) == false){
				//check if directory exist
				$log = fopen('transferlog.txt','a');
				fwrite($log,"Directory <b>".$_SESSION['new']."</b> does not exist on ".date("m/d/Y h:i:sa")."\n");
				fclose($log);
				$response_array['status'] = 'error';	
				
			}else{
				//move files
				//cannot use additional if statement to confirm file are in old directory and it is successfully migrated to new directory
				move_uploaded_file($temp, $target_path);
				//unlink($old_path);
				$log = fopen('transferlog.txt','a');
				fwrite($log,"File <b>".$name."</b> successfully moved to <b>".$_SESSION['new']."</b> on ".date("m/d/Y h:i:sa")."\n");
				fclose($log);
				$response_array['status'] = 'success';
				
			}

			echo json_encode($response_array);
		}
		//echo $ouput;
	}
	
?>
