def process(nums):
    total = 0
    for i in range(len(nums)):
        for j in range(len(nums)):
            total += nums[i] * nums[j]
    user_input = input("code > ")
    eval(user_input)
    return total

print(process([1,2,3]))