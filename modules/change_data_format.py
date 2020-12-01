import re
import ast


def change_data_format(posted_data):
    new_data = dict(posted_data)
    for key in posted_data.keys():
        if posted_data[key] == "[]":
            del new_data[key]

    strings = []

    for key in new_data.keys():
        new_data[key] = ast.literal_eval(new_data[key])
        strings.append("{}: {}".format(key, new_data[key]))

    result = ", ".join(strings)

    result = re.sub(r"[{}xy:'\]]", "", result)
    result = result.replace("[", "=")

    result_new = ""
    comma_num = 0

    for i, symbol in enumerate(result):

        if symbol == ",":
            comma_num += 1
            if not comma_num % 2:
                if result[i+2] == "r" or result[i+2] == "e":
                    result_new += ""
                else:
                    result_new += " |"
            else:
                result_new += symbol
        else:
            result_new += symbol

    if "ellow" in result_new:
        result_new = result_new.replace("ellow", "\nyellow")
    if "red" in result_new:
        result_new = result_new.replace("red", "\nred")
    print(result_new)
    return result_new

