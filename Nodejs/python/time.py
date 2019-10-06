#Import neccesary libraries
import pandas as pd
import matplotlib.pyplot as plt
import sys

transactions = pd.read_csv('transactions.csv')
# merchants = pd.read_csv('merchants.csv')
transactions['date'] = pd.to_datetime(transactions['timestamp'] + 68400000, utc = True,unit='ms', origin='unix')

pd.to_datetime([1564597378535 + 68400000], unit = 'ms', origin = 'unix')
transactions['dayofweek'] = transactions[   'date'].dt.dayofweek
transactions['hour'] = pd.DatetimeIndex(transactions['date']).hour
transactions['hour'] = transactions['hour'].astype(int)
transactions['hour'] = transactions['hour'].replace(24,0)

def recommendation_hour(user_id, hour):
    cluster = [[1, 2, 3],[4, 5, 6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20,21],[22,23,0]]
    where = -1
    for idx, val in enumerate(cluster):
        if(hour in val):
            where = idx
            break
    if where == -1:
        return []
    res = transactions[transactions['user_id'] == user_id]
    x = cluster[where][0]
    y = cluster[where][1]
    z = cluster[where][2]
    a = res[res['hour'] ==x]
    b = res[res['hour'] ==y]
    c = res[res['hour'] ==z]
    res = pd.concat([a,b,c])#.tolist()
    if res.shape[0] < 3:
        temp = transactions[transactions['hour'] ==x]
        temp = transactions[transactions['hour'] ==y]
        temp = transactions[transactions['hour'] ==z]
        temp = temp['service_id'].value_counts().index[:10].tolist()
        res = res['service_id'].tolist()  + temp
    return res[:3]
  
#inp = 8159657106479438377
#when = 7

inp = sys.argv[1]
when = sys.argv[2]
print(inp, when)
rem = recommendation_hour(int(inp), int(when))
print(rem)
output = pd.DataFrame(rem, columns =['recommend'])
# output['recommend'] = output['recommend'].apply(lambda x : ',' + str(x))
output.to_csv('time.csv', index = False)