importScripts('destroyer.js');
{
    const msg = postMessage;
    const die = close;
    msg(destroyGlobalThis(true));
    die();
}