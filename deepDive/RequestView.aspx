<%@ Page Language="VB" AutoEventWireup="false" CodeFile="RequestView.aspx.vb" Inherits="DsttsBoard_RequestView" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>제목 없음</title>

    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

        * {
            font-family: "Noto Sans KR", serif;
        }

        #b {
            margin-left: 10px;
        }

        a:visited,
        a:link {
            text-decoration: underline;
            text-decoration-color: red;
            color: black;
        }

        a:active {
            text-decoration: none;
            color: black;
        }

        a:hover {
            text-decoration: none;
            color: dodgerblue;
        }

        font:hover {
            color: dodgerblue;
        }

        #chkDay {
            width: 16px;
            height: 16px;
            margin: 0;
            margin-right: 5px;
            cursor: pointer;
        }

        select, input[type="text"], input[type="date"] {
            font-family: "Noto Sans KR", serif;
            height: 28px;
            border: 1px solid #aaa;
            border-radius: 3px;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            box-sizing: border-box;
            margin-top: 3px;
        }

        input[type="date"] {
            margin-top: 3px;
            width: 186px;
            text-align: center;
        }

        select {
            padding-left: 10px;
            width: 400px;
        }

        input[type="text"] {
            cursor: text;
        }

        input[type="radio"] {
            display: none;
        }

            input[type="radio"] + label {
                cursor: pointer;
                color: #666;
            }

            input[type="radio"]:checked + label {
                position: relative;
                color: #598CBD;
            }

                input[type="radio"]:checked + label::after {
                    display: block;
                    content: "";
                    width: 60px;
                    height: 3px;
                    background-color: #598CBD;
                    position: absolute;
                    bottom: -9px;
                    left: 50%;
                    transform: translateX(-50%);
                }

        td {
            font-size: 14px;
            padding: 0;
            border: 0;
        }

        .table_header {
            height: 32px;
            font-weight: 400;
        }

        #cmdSearch {
            opacity: 0;
        }

        label[for="chkDay"] {
            font-weight: 500;
            font-size: 15px;
            font-weight: 400;
            cursor: pointer;
        }

        label[for="cmdSearch"] {
            display: inline-block;
            width: 80px;
            height: 28px;
            background-color: #fff;
            border: 1px solid #4582DD;
            color: #4582DD;
            border-radius: 3px;
            line-height: 0px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            vertical-align: bottom;
            margin-left: 20px;
            line-height: 28px;
            text-align: center;
            box-sizing: border-box;
        }

            label[for="cmdSearch"]:hover {
                background-color: #4582DD;
                color: #fff;
            }

        #chkDeEx,
        #chk1,
        #chk2,
        #chk3,
        #chk4 {
            font-size: 15px;
            width: 16px;
            height: 16px;
            margin: 0;
            margin-right: 5px;
            vertical-align: middle;
            cursor: pointer;
        }

            #chkDeEx + label,
            #chk1 + label,
            #chk2 + label,
            #chk3 + label,
            #chk4 + label {
                font-size: 15px;
                line-height: 16px;
                cursor: pointer;
                vertical-align: middle;
            }

        .wrapper > table {
            width: calc(100vw - 200px);
            max-width: 1280px;
            min-width: 900px;
        }

        #LabTitle{
            font-weight: 500; 
            font-size:22px; 
            padding-left: 10px;
        }

        .search_box {
            width: 100%;
            height: 17px;
            color: #000000;
            background-color: #F3F3F3;
            border-top: 1px solid #9d9d9d;
            border-bottom: 1px solid #9d9d9d;
            padding: 12px 0;
        }

            .search_box > tbody > tr {
                height: 34px;
            }

        .search_box-title {
            font-weight: 400;
            vertical-align: middle;
            width: 100px;
            text-align: center;
            font-size: 15px;
        }

        #txtTitle{
            font-size: 14px; 
            padding-left: 10px; 
            width:400px; 
            margin-top: 3px;
        }
        #fpsList {
            width: 100%;
            border: 1px solid transparent;
            color: #333;
        }        
        #fpsList td {
            text-align: center;
        }

        #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
            height: 36px;
        }

        #fpsList tr:not(:first-of-type):not(:last-of-type):hover {
            background-color: #ffefec !important;
        }

        #fpsList tr:last-of-type {
            letter-spacing: 3px;
        }

            #fpsList tr:last-of-type a {
                text-decoration: none;
                color: #c0c0c0;
            }

                #fpsList tr:last-of-type a:hover {
                    color: red !important;
                }

        #fpsList .table_title {
            text-align: left;
            min-width: 220px;
        }

        #fpsList > tbody > tr > td {
            padding: 0 10px;
            white-space: nowrap;
        }
        
        @media screen and (min-width: 1200px) {
            td {
                font-size: 15px;
            }

            #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
                height: 40px;
            }
        }
        @media screen and (max-width: 1000px) {
            #fpsList > tbody > tr > td {
                padding: 0 3px;
            }
        }
    </style>

</head>

<body>
    <form id="form1" runat="server">
        <div class="wrapper">
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <table>
                <tr>
                    <td align="left">
                        <asp:Label ID="LabTitle" runat="server">요청서 처리작업</asp:Label>
                    </td>
                </tr>
                <tr style="height: 12px;"></tr>
                <tr>
                    <td class="search_box" align="center">
                        <table style="width: 100%;">
                            <tr>
                                <td class="search_box-title">구 &nbsp; &nbsp; 분</td>
                                <td>
                                    <asp:DropDownList ID="cmbSection" runat="server">
                                        <asp:ListItem Value="0">전체</asp:ListItem>
                                        <asp:ListItem Value="10">프로그램 수정 요청서</asp:ListItem>
                                        <asp:ListItem Value="11">데이타 요청서</asp:ListItem>
                                        <asp:ListItem Value="120">전표 수정 요청서</asp:ListItem>
                                        <asp:ListItem Value="121">전표 삭제 요청서</asp:ListItem>
                                        <asp:ListItem Value="130">할인 요청서</asp:ListItem>
                                        <asp:ListItem Value="131">할증 요청서</asp:ListItem>
                                        <asp:ListItem Value="132">현금할인 요청서</asp:ListItem>
                                        <asp:ListItem Value="04">OO계</asp:ListItem>
                                        <asp:ListItem Value="05">출장신청서</asp:ListItem>
                                        <asp:ListItem Value="17">디자인기안서</asp:ListItem>
                                        <asp:ListItem Value="22">소모품신청서</asp:ListItem>
                                    </asp:DropDownList>
                                    <div style="margin-left: 20px; display: inline-block;">
                                        <asp:CheckBox ID="chkDeEx" runat="server" Text="디자인제외" />&nbsp;
                                        <asp:CheckBox ID="chk1" runat="server" Text="승인" />&nbsp;
                                        <asp:CheckBox ID="chk2" runat="server" Text="미처리" />&nbsp;
                                        <asp:CheckBox ID="chk3" runat="server" Text="완료" />&nbsp;
                                        <asp:CheckBox ID="chk4" runat="server" Text="재요청건" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="search_box-title">날 &nbsp; &nbsp; 짜</td>
                                <td>
                                    <asp:TextBox ID="txtDate" runat="server" TextMode="Date"></asp:TextBox>
                                    <span style="display:inline-block; text-align:center; width: 20px; font-size: 16px; line-height: 11px;">~</span>
                                    <asp:TextBox ID="txtDate2" runat="server" TextMode="Date"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td class="search_box-title">제 &nbsp; &nbsp; 목</td>
                                <td>
                                    <asp:TextBox ID="txtTitle" runat="server"></asp:TextBox>
                                    <label for="cmdSearch">검색</label>
                                    <asp:ImageButton ID="cmdSearch" runat="server" ImageUrl="~/images/button/btn_search.gif" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="height: 12px;"></tr>
                <tr >
                    <td style="width: 100%">
                        <asp:DataGrid ID="fpsList" runat="server" AllowPaging="True" AutoGenerateColumns="False" CellPadding="4" Font-Strikeout="False" Font-Underline="False" PageSize="20">
                            <HeaderStyle CssClass="table_header" BackColor="#4582DD" ForeColor="White"  HorizontalAlign="Center" />
                            <ItemStyle BackColor="#f9fbfe" Font-Size="9pt" />
                            <AlternatingItemStyle BackColor="White" />
                            <PagerStyle BackColor="#4582DD" ForeColor="White" HorizontalAlign="Center" Mode="NumericPages" Height="32px"/>
                            <Columns>
                                <asp:BoundColumn HeaderText="문서번호"><ItemStyle Font-Bold="True"/></asp:BoundColumn>
                                <asp:BoundColumn DataField="indexdate" DataFormatString="{0:yyyy-MM-dd}" HeaderText="일자"></asp:BoundColumn>
                                <asp:BoundColumn DataField="deptname" HeaderText="부서명"></asp:BoundColumn>
                                <asp:BoundColumn DataField="username" HeaderText="작성자"></asp:BoundColumn>
                                <asp:BoundColumn DataField="usercode" HeaderText="작성자코드"></asp:BoundColumn>
                                <asp:BoundColumn HeaderText="승인여부"><ItemStyle Font-Bold="True" /></asp:BoundColumn>
                                <asp:BoundColumn DataField="title" FooterText="합계금액" HeaderText="제목" ItemStyle-CssClass="table_title"></asp:BoundColumn>
                                <asp:BoundColumn DataField="section" HeaderText="구분" ItemStyle-Width="100px"></asp:BoundColumn>
                                <%--<asp:BoundColumn HeaderText="상세"></asp:BoundColumn>--%>
                                <asp:TemplateColumn HeaderText="처리여부">
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 80%">
                                                    <asp:Label ID="labExpen01" runat="server" Font-Bold="False" Font-Size="9pt" ForeColor="#0000C0"><%# DataBinder.Eval(Container.DataItem, "text1").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text2").ToString %></asp:Label></td>
                                                <td align="right" style="width: 20%">
                                                    <asp:Button ID="cmdsReSave" runat="server" CommandName="ReSave" Text="재요청" Visible="False" />
                                                    <asp:ImageButton ID="cmdExpen01" runat="server" CommandName="Expense01" ImageUrl="~/DsttsBoard/Image/Expen01.gif" /></td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:TemplateColumn HeaderText="처리여부(사진)">
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 80%">
                                                    <asp:Label ID="labExpen02" runat="server" Font-Bold="False" Font-Size="9pt" ForeColor="#0000C0"><%# DataBinder.Eval(Container.DataItem, "text4").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text5").ToString %></asp:Label>
                                                </td>
                                                <td align="right" style="width: 20%">
                                                    <asp:ImageButton ID="cmdExpen02" runat="server" CommandName="Expense02" ImageUrl="~/DsttsBoard/Image/Expen01.gif" />
                                                </td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                </asp:TemplateColumn>
                                <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                <asp:BoundColumn DataField="text10" HeaderText="구분상세" Visible="False"></asp:BoundColumn>
                            </Columns>
                            <FooterStyle BackColor="#4582DD" Font-Bold="True" ForeColor="White" />
                            <EditItemStyle BackColor="#2461BF" />
                            <SelectedItemStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                        </asp:DataGrid></td>
                </tr>
                <tr >
                    <td align="right" style="width: 100%"></td>
                </tr>
                <tr >
                    <td align="center" style="width: 100%">&nbsp; &nbsp;</td>
                </tr>
            </table>
            <br />

            <ajaxToolkit:CalendarExtender ID="calendarButtonExtender" runat="server" Format="yyyy-MM-dd"
                PopupButtonID="cmdCal" TargetControlID="txtDate"></ajaxToolkit:CalendarExtender>
            <ajaxToolkit:CalendarExtender ID="calendarButtonExtender2" runat="server" Format="yyyy-MM-dd"
                PopupButtonID="cmdCal2" TargetControlID="txtDate2"></ajaxToolkit:CalendarExtender>
        </div>
    </form>
</body>
</html>
