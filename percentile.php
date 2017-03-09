<?php
/* Quick and dirty response for percentile WPM */

/* Get Post Data */
$wpm = $_POST['wpm'];
if(empty($wpm)) {
    die('Empty wpm!');
}

/* Connect to DB */
$root = $_SERVER['DOCUMENT_ROOT'];
$config = parse_ini_file($root . '/../php-mysql-config.ini');
$conn = mysqli_connect('localhost', $config['username'], $config['password'], $config['dbname']);
if(! $conn ) {
    die('Could not connect: ' . mysqli_connect_error());
}

$wpm = mysqli_real_escape_string($conn, $wpm);
$accuracy = mysqli_real_escape_string($conn, $_POST['accuracy']);
$state = mysqli_real_escape_string($conn, $_POST['state']);
$uid = mysqli_real_escape_string($conn, $_POST['uid']);
$ip = $_SERVER['REMOTE_ADDR'];

/* Get total number of rows */
$sql_tot = "select count(*) as total from wpm";
$result_tot = mysqli_query($conn, $sql_tot);
$data_tot = mysqli_fetch_assoc($result_tot);
$tot = $data_tot['total'];

/* Get number of rows below our score */
$sql_rnk = "select count(*) as total from wpm where wpm < '$wpm'";
$result_rnk = mysqli_query($conn, $sql_rnk);
$data_rnk = mysqli_fetch_assoc($result_rnk);
$rnk = $data_rnk['total'];

/* Calculate percentile */
$percentile = intval(($rnk * 100) / ($tot + 1));

echo $percentile;

$sql = "insert into wpm(wpm,accuracy,state,time,ip,uid) VALUES('$wpm','$accuracy','$state',NOW(),'$ip','$uid')";
$result = mysqli_query($conn, $sql);

/* Done */
mysqli_close($conn);
?>

