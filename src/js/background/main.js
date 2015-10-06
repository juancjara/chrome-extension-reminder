console.log('background script ready!!');

import Omnibox from '../chrome-api/omnibox';
import Alarm from '../chrome-api/alarm';
import Notification from '../chrome-api/notification';
import Utils from '../utils';

Notification.title = 'reminder';

let parseText = function(text) {
  let parts = text.split(' ');
  parts.shift();
  return parts.join(' ');
};

let parseTime = function(text) {
  return {
    delayInMinutes: Number(text.split(' ')[0])
  };
};

let handleAlarm = function(message) {
  (new Audio('../media/alarm.mp3')).play();
  Notification.create({message}, () => {});
};

Omnibox.onChange((text, suggest) => {
  suggest([
    {content: 'in 10m update', description: 'time | text'}
  ])
});

Omnibox.onSubmit((text) => {
  text = text.trim();
  let reminderName = parseText(text);
  Alarm.set('reminder', parseTime(text),
            Utils.partial(handleAlarm, reminderName));
  let message = 'Alarm set';
  Notification.create({message}, () => {});
})
