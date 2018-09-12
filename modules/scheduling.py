import sched  
import datetime, time

class PeriodicScheduler(object):                                                  
    def __init__(self):                                                           
        self.scheduler = sched.scheduler(time.time, time.sleep)                   
                                                                            
    def setup(self, interval, action, actionargs=()):                             
        action(*actionargs)                                          
        self.scheduler.enter(interval, 1, self.setup,                             
                        (interval, action, actionargs))                           
                                                                        
    def run(self):                                                                
        self.scheduler.run(False)
