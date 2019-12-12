#import neccesary libraries
import pandas as pd
import sys
#read data from files

mapMerchant = pd.read_csv("uniqueMerchants.csv")[['service_id', 'specific']]
transactions = pd.read_csv("cleaned_transactions.csv")

def recommendation_hour2(df, user_id, hour):
    cluster = [[1, 2, 3],[4, 5, 6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20,21],[22,23,0]]
    where = -1
    for idx, val in enumerate(cluster):
        if(hour in val):
            where = idx
            break
    if where == -1:
        return []
    
    x = cluster[where][0]
    y = cluster[where][1]
    z = cluster[where][2]
    
    him = df[df['user_id'] == user_id]
    
    him1 = him[him['hour'] == x]
    him1 = him1[~him1.specific.str.contains("CVS", na=False)]
    him1 = him1[~him1.specific.str.contains("Mass Merchant", na=False)]
    
    him2 = him[him['hour'] == y]
    him2 = him2[~him2.specific.str.contains("CVS", na=False)]
    him2 = him2[~him2.specific.str.contains("Mass Merchant", na=False)]
    
    him3 = him[him['hour'] == z]
    #him3 = him3[~him3.specific.str.contains("CVS", na=False)]
    #him3 = him3[~him3.specific.str.contains("Mass Merchant", na=False)]
    
    himRes = him1
    himRes.append(him2)
    himRes.append(him3)
    himRes = himRes['service_id'].value_counts().index[:3]
    himRes = pd.DataFrame({'service_id': himRes})
    himRes = himRes.merge(mapMerchant, on = 'service_id', how ='left')
    
    #if not enough, add overall preference data
    if(himRes.shape[0] < 3):
        res = df
        a = res[res['hour'] == x]
        a = a[~a.specific.str.contains("CVS", na=False)]
        a = a[~a.specific.str.contains("Mass Merchant", na=False)]

        b = res[res['hour'] == y]
        b = b[~b['specific'].str.contains('CVS', na=False)]
        b = b[~b['specific'].str.contains('Mass Merchant', na=False)]

        c = res[res['hour'] == z]
        c = c[~c['specific'].str.contains("CVS", na=False)]
        c = c[~c['specific'].str.contains("Mass Merchant", na=False)]

        res = a
        res = res.append(b)
        res = res.append(c)
        res = res['service_id'].value_counts().index
        res = pd.DataFrame({'service_id': res})
        res = res.merge(mapMerchant, on = 'service_id', how ='left')
        
        #add to personalized data
        himRes = himRes.append(res)
    
    himRes = himRes[:3]
    himRes['user_id'] = [user_id for i in range(0,3)]
    himRes['start'] = str(cluster[where][0] - 1) + ":00:00"
    if cluster[where][2] == 0 :
        himRes['end'] = "24:00:00"
    else:
        himRes['end'] = str(cluster[where][2])+ ":00:00"
    himRes['rank'] = [1, 2, 3]
    return himRes

def produceCSV(df, user_id):
    loop = [4,7,10,13,16,19,22]
    recommend = recommendation_hour2(df, user_id, 1)
    for val in loop:
        each = recommendation_hour2(df, user_id, val)
        recommend = recommend.append(each)
    columnsTitles=["user_id","service_id", "specific", "start", "end", "rank"]
    recommend = recommend.reindex(columns = columnsTitles)
    recommend.to_csv("result.csv", index = False)

def main():

    user_id = sys.argv[1]
    produceCSV(transactions, user_id)

if __name__ == "__main__":
    main()
