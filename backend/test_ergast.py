import httpx
import asyncio

async def test_driver(last_name):
    async with httpx.AsyncClient(base_url="http://api.jolpi.ca/ergast/f1", follow_redirects=True) as client:
        resp = await client.get(f"/drivers.json?limit=1000")
        data = resp.json()
        for d in data['MRData']['DriverTable']['Drivers']:
            if last_name.lower() in d['familyName'].lower():
                print(f"Found id for {last_name}:", d['driverId'])
                
        # Let's test wins for max_verstappen
        resp = await client.get("/drivers/max_verstappen/results/1.json?limit=1")
        print("Max Wins:", resp.json()['MRData']['total'])

asyncio.run(test_driver("verstappen"))
