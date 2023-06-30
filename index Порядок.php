<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Vue Example</title

  </head>
  <body>
<?php

class ChatNotificationManager {
  function notify($message) {
    // ...
  }
}
class ChatMessageRepository {
  public function save($message) {
    // ...
  }
}

class ChatMessage {
  private ?int $id; // nullable
  private ?int $chatId; // nullable
  private UserInterface $user;
  private string $text;
  
  public function __construct($chat, $user, $text) {
    $this->chatId = $chatId;
    $this->user = $user;
    $this->text = $text;
    $chatNotificationManager = new ChatNotificationManager();
    $chatNotificationManager->notify($message);
  }
}
class Chat {
  public int $id;
  public ChatMessage $message; // return ChatMessage object
  
  public function addMessage($user, $text) {
    $message = new ChatMessage($this->id, $user, $text);
    $chatMessageRepository = new ChatMessageRepository();
    $chatMessageRepository->save();
  }
}


$chat = new ChatMessage(123, 'user', 'text');
$chat = new Chat('user', 'text');

//
// Определить город по IP
//

// 1st
// use classes from https://gist.github.com/nalgeon/79a7609bf24bc0e833699f7eca125e86
// saved it in lib/services/dadata.php
require_once('lib/services/dadata.php');

// 2nd
$token = "ВАШ_API_КЛЮЧ";
$secret = "ВАШ_СЕКРЕТНЫЙ_КЛЮЧ";

$dadata = new Dadata($token, $secret);
$dadata->init();

$client  = @$_SERVER['HTTP_CLIENT_IP'];
$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
$remote  = @$_SERVER['REMOTE_ADDR'];
 
if(filter_var($client, FILTER_VALIDATE_IP)) $ip = $client;
elseif(filter_var($forward, FILTER_VALIDATE_IP)) $ip = $forward;
else $ip = $remote;

$result = $dadata->iplocate($ip);
echo $result;
?>    
    
  </body>
</html>