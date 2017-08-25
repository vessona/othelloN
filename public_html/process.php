<?php
$n1 = $_POST['player1Name'];
$n2 = $_POST['player2Name'];
$s1 = $_POST['score1'];
$s2 = $_POST['score2'];
date_default_timezone_set('America/Los_Angeles');
$date = date('m/d/Y h:i:s a', time());

$servername = "ec2-34-207-252-72.compute-1.amazonaws.com";
$username = "fAjaxDB_user31";
$password = "fAjaxDB_user31";
$dbname = "fAjaxDB_user31";


//$sql = "INSERT INTO Victories SET Player_Names = '$w1', Score = 1
//ON DUPLICATE KEY UPDATE Score = Score + 1;";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "INSERT INTO game (name, score, date)
VALUES ('$n1', '$s1' , '$date') ON DUPLICATE KEY UPDATE score='$s1', date ='$date'";
$sql2 = "INSERT INTO game (name, score, date)
VALUES ('$n2', '$s2', '$date') ON DUPLICATE KEY UPDATE score='$s2', date ='$date'";
if ($conn->query($sql) === TRUE && $conn->query($sql2) === TRUE ) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();


?>