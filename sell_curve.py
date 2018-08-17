curve_order = (6, 2, 4, 7, 5, 8, 3)

def sell_curve(n):
    curve = {}
    for price in curve_order:
        curve[price] = n // len(curve_order)
    
    for price in curve_order[:n % len(curve_order)]:
        curve[price] += 1
    
    return curve