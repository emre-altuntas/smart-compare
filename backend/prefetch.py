import asyncio
import os
import sys

# Add current dir so services is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services.f1 import get_f1_athlete

async def main():
    slugs = ["verstappen", "hamilton", "schumacher"]
    for s in slugs:
        print(f"Prefetching {s}...")
        data = await get_f1_athlete(s)
        if data:
            print(f"Success for {s}: {data['wins']} wins")
        else:
            print(f"Failed for {s}")

if __name__ == "__main__":
    asyncio.run(main())
