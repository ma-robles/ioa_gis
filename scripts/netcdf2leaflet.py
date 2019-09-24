# coding: utf-8

from netCDF4 import Dataset, num2date
import numpy as np
import json
import sys

filename =sys.argv[1]
print(filename)

# import data
dataset = Dataset(filename)

# interrogate dimensions
print(dataset.dimensions.keys())

# interrogate variable structure
print(dataset.variables['U10'])

# interrogate variables
# find the u and v wind data
print("Check variables:")
print(dataset.variables.keys())

# USER input names for u and v wind variables
u_var = 'U10'
v_var = 'V10'

print("Check units:")
print(dataset.variables[u_var].units)

print("Check dimensions:")
print(dataset.variables[u_var].dimensions, dataset.variables[u_var].shape)

# set header variables for wind
nx = dataset.variables[u_var].shape[2]
ny = dataset.variables[u_var].shape[1]
tot = nx * ny

# get data for u wind
a = dataset.variables[u_var][:][0]
A = np.matrix(a)
b = A.flatten()
c = np.ravel(b).T
u_data = c.tolist()

# get data for v wind
a = dataset.variables[v_var][:][0]
A = np.matrix(a)
b = A.flatten()
c = np.ravel(b).T
v_data = c.tolist()

dy=dataset.variables['lat'][:][0,0]
dy-=dataset.variables['lat'][:][1,0]
dx=dataset.variables['lon'][:][0,1]
dx-=dataset.variables['lon'][:][0,0]
la1=dataset.variables['lat'][:][1,0]
la2=dataset.variables['lat'][:][-1,0]
lo1=dataset.variables['lon'][:][0,1]
lo2=dataset.variables['lon'][:][0,-1]
print('nx:',nx)
print('ny:',ny)
print('dy:',dy, dy*ny)
print('dx:',dx,dx*nx)
print('la:',la1,la2)
print('lo:',lo1,lo2)
# format JSON
wind_data = [{
  "header": {
    "parameterNumberName": "eastward_wind",
    "parameterUnit": "m.s-1",
    "parameterNumber": 2,
    "parameterCategory": 2,
    "nx": nx,
    "ny": ny,
    "numberPoints": tot,
    "dx": dx,
    "dy": dy,
    "la1": la1,
    "lo1": lo1,
    "la2": la2,
    "lo2": lo2,
    "refTime": "2017-02-01 23:00:00"
  },
  "data": u_data
}, {
  "header": {
    "parameterNumberName": "northward_wind",
    "parameterUnit": "m.s-1",
    "parameterNumber": 3,
    "parameterCategory": 2,
    "nx": nx,
    "ny": ny,
    "numberPoints": tot,
    "dx": dx,
    "dy": dy,
    "la1": la1,
    "lo1": lo1,
    "la2": la2,
    "lo2": lo2,
    "refTime": "2017-02-01 23:00:00"
  },
  "data": v_data
}]

# write JSON for leaflet-velocity input
with open('wind.json', 'w') as outfile:  
    json.dump(wind_data, outfile, separators=(',', ':'))


