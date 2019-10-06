#Import neccesary libraries
import pandas as pd
import time
import matplotlib.pyplot as plt
import sys

s=time.time()
transactions = pd.read_csv('./transactions.csv')
transactions = transactions.tail(1000000)
transactions['date'] = pd.to_datetime(transactions['timestamp'] + 68400000, utc = True,unit='ms', origin='unix')
#pd.to_datetime([1564597378535 + 68400000], unit = 'ms', origin = 'unix') #Example
#transactions['dayofweek'] = transactions['date'].dt.dayofweek
transactions['hour'] = pd.DatetimeIndex(transactions['date']).hour.astype(int)
#transactions['hour'] = transactions['hour'].astype(int)
transactions['hour'] = transactions['hour'].replace(24,0)



clusters = [[1, 2, 3],[4, 5, 6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20,21],[22,23,0]]

def recommendation_hour(user_id, hour):
    res = transactions[transactions['user_id'] == user_id]
    x = clusters[where][0]
    y = clusters[where][1]
    z = clusters[where][2]
    a = res[res['hour'] ==x]
    b = res[res['hour'] ==y]
    c = res[res['hour'] ==z]
    res = pd.concat([a,b,c])#.tolist()
    if res.shape[0] < 5:
        temp = transactions[transactions['hour'] ==x]
        temp = transactions[transactions['hour'] ==y]
        temp = transactions[transactions['hour'] ==z]
        temp = temp['service_id'].value_counts().index[:10].tolist()
        res = res['service_id'].tolist()  + temp
    return res[:5]
  
#inp = 8159657106479438377
#when = 7

inp = sys.argv[1]
when = sys.argv[2]

where = -1
for idx, val in enumerate(clusters):
    if int(when) in val:
        where = idx
        break
if where ==-1:
    rem = []
else:
    rem = recommendation_hour(int(inp), int(when))

output = pd.DataFrame(rem, columns =['recommend'])
output['recommend'] = output['recommend'].apply(lambda x : ',' + str(x))
output['start'] = clusters[where][0]
output['end'] = clusters[where][2]
output['rank'] = [1,2,3,4,5]
output.to_csv('time.csv', index = False)

print("Execution time:", round((time.time()-s)/60,2), "minutes")