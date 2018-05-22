<?php
if(is_wap() && (empty($_SERVER['PATH_INFO']) || '/index/index'==$_SERVER['PATH_INFO'])){
    header('Location:/m/index.php');
    exit;
}

//定义项目名称和路径
define('SUNLINE_CREDIT', 'MADE IN SUNLINE');
define('IN_CONTEXT', 'MADE IN SUNLINE');
define('DS', DIRECTORY_SEPARATOR);
define('APP_NAME', '');
define('APP_PATH', dirname(dirname(__FILE__)) . DS);
define('APP_DEBUG', true);
define('APP_STATUS', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
define('APP_ROOT', strlen(dirname($_SERVER['SCRIPT_NAME']))==1? "/" : dirname($_SERVER['SCRIPT_NAME']) . "/" );
define('PUBLIC_PATH', APP_PATH . 'wwwroot/Public/');
define('SUNAPP_ROOT_PATH', dirname(__FILE__) . DS);
define('SUNAPP_UPLOAD_PATH', SUNAPP_ROOT_PATH . 'Uploads' . DS);
define('SHORT_NAME', 'JDY');
define('LOG_PATH', APP_PATH . 'Runtime' . DS . 'Logs'. DS . APP_STATUS . DS);
// 加载框架入口文件
require(APP_PATH. 'ThinkPHP/ThinkPHP.php');

function run_time(){
    list($msec, $sec) = explode(' ', microtime());
    return ( (float)$msec + (float)$sec );
}

//判断是否移动端
function is_wap(){
    $_SERVER['ALL_HTTP'] = isset($_SERVER['ALL_HTTP']) ? $_SERVER['ALL_HTTP'] : '';
    $mobile_browser = '0';
    if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|iphone|ipod|android|xoom)/i', strtolower($_SERVER['HTTP_USER_AGENT'])))
        $mobile_browser++;
    if ((isset($_SERVER['HTTP_ACCEPT'])) and (strpos(strtolower($_SERVER['HTTP_ACCEPT']), 'application/vnd.wap.xhtml+xml') !== false))
        $mobile_browser++;
    if (isset($_SERVER['HTTP_X_WAP_PROFILE']))
        $mobile_browser++;
    if (isset($_SERVER['HTTP_PROFILE']))
        $mobile_browser++;
    $mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
    $mobile_agents = array(
        'w3c ', 'acs-', 'alav', 'alca', 'amoi', 'audi', 'avan', 'benq', 'bird', 'blac',
        'blaz', 'brew', 'cell', 'cldc', 'cmd-', 'dang', 'doco', 'eric', 'hipt', 'inno',
        'ipaq', 'java', 'jigs', 'kddi', 'keji', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-',
        'maui', 'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'nec-',
        'newt', 'noki', 'oper', 'palm', 'pana', 'pant', 'phil', 'play', 'port', 'prox',
        'qwap', 'sage', 'sams', 'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar',
        'sie-', 'siem', 'smal', 'smar', 'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-',
        'tosh', 'tsm-', 'upg1', 'upsi', 'vk-v', 'voda', 'wap-', 'wapa', 'wapi', 'wapp',
        'wapr', 'webc', 'winw', 'winw', 'xda', 'xda-'
    );
    if (in_array($mobile_ua, $mobile_agents))
        $mobile_browser++;
    if (strpos(strtolower($_SERVER['ALL_HTTP']), 'operamini') !== false)
        $mobile_browser++;
    // Pre-final check to reset everything if the user is on Windows
    if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows') !== false)
        $mobile_browser = 0;
    // But WP7 is also Windows, with a slightly different characteristic
    if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows phone') !== false)
        $mobile_browser++;
    if ($mobile_browser > 0)
        return true;
    else
        return false;
}
