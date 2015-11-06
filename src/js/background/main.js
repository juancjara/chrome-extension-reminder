console.log('background script ready!!');

import Omnibox from '../chrome-api/omnibox';
import Alarm from '../chrome-api/alarm';
import Notification from '../chrome-api/notification';
import Utils from '../utils';

Alarm.setup();
Notification.title = 'Reminder';

let parseContentFrom = (text) => {
  let parts = text.split(' ');
  parts.shift();
  return parts.join(' ');
};

let parseTimeFrom = (text) => {
  return {
    delayInMinutes: Number(text.split(' ')[0])
  };
};

let handleAlarm = (name, message) => {
  (new Audio('../media/alarm.mp3')).play();
  Alarm.clear(name);
  Notification.create({message}, () => {});
};

Omnibox.onChange((text, suggest) => {
  suggest([
    {content: '10 alarmName', description: 'time | text'}
  ]);
});

Omnibox.onSubmit((text) => {
  text = text.trim();
  let content = parseContentFrom(text);
  let alarmName = Date.now().toString();

  Alarm.create(alarmName, parseTimeFrom(text),
               Utils.partial(handleAlarm, alarmName, content));

  let message = `Alarm ${content} set`;
  Notification.create({message}, () => {});
});
