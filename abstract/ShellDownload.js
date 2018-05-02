const Download = require('./Download');
const spawn = require('child_process').spawn;
const parse = require('parse-spawn-args').parse;

class ShellDownload extends Download {
  _buildCommand() {
    return `echo ${this.source} ${this.out}`;
  }
  async go() {
    const that = this;
    const command = this._buildCommand();
    const commandParts = command.split(/ (.+)/);
    const commandName = commandParts[0];
    const args = parse(commandParts[1]);
    return new Promise((resolve, reject) => {
      let process = spawn(commandName, args);
      let oldProgress = -1;
      let isStarted = false;
      const listener = (data) => {
        if (!isStarted) {
          isStarted = that._parseStart(data.toString());
        }
        if (that.options.onProgress && isStarted) {
          const progress = that._parseProgress(data.toString());
          if (progress && (progress > oldProgress)) {
            that.options.onProgress(progress);
            oldProgress = progress;
          }
        }
      };
      process.stderr.on('data', listener);
      process.stdout.on('data', listener);
      process.on('error', (error) => {
        reject(error);
      });
      process.on('exit', function(code) {
        if (code != 0) {
          reject(code);
        } else {
          resolve();
        }
      });
    });
  }
  _parseStart() {
    return true;
  }
  _parseProgress(output) {
    return 100;
  }
}

module.exports = ShellDownload;
