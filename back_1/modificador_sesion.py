import csv

arrayAsig = []

with open('2024-04-01-8-39_2_totalActivities.csv', newline='') as f:
    reader = csv.reader(f)
    c = 0
    for row in reader:
        if c != 0:
            row[0] = "2024-04-01-8-38"
        arrayAsig.append(row)
        c = c + 1 


with open('2024-04-01-8-39_2_totalActivities_copy.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    for asigAux in arrayAsig:
        print(asigAux)
        writer.writerow(asigAux)

