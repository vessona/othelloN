<?php

$servername = "ec2-34-207-252-72.compute-1.amazonaws.com";
$username = "fAjaxDB_user31";
$password = "fAjaxDB_user31";
$dbname = "fAjaxDB_user31";

$conn = new mysqli($servername, $username, $password, $dbname);



if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM game ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
 echo "<h4>Top 10<h4><table id='res'><tr><th>Name</th><th>Score</th><th>Date</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>". $row["name"]. "</td><td>". $row["score"]."</td><td>". $row["date"]."</td></tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}

$conn->close();
?> 