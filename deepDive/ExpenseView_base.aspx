<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ExpenseView.aspx.vb" Inherits="DsttsBoard_ExpenseView" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<%@ Register Assembly="TaeyoNetLib" Namespace="TaeyoNetLib" TagPrefix="taeyo" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">

    <title>지출 품의서 처리작업</title>
       
   <script type="text/javascript" language="JavaScript"> 
        var initBody
        function beforePrint()
        { 
         initBody = document.body.innerHTML; 
         document.body.innerHTML = idPrint.innerHTML;
        } 

        function afterPrint()
        { 
         document.body.innerHTML = initBody; 
        } 

        function printArea() 
        { 
         window.print(); 
        }

        window.onbeforeprint = beforePrint; 
        window.onafterprint = afterPrint; 

    </script>
    
    
    
    
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

        * {
            font-family: "Noto Sans KR", serif;
        }

        #b {
            margin-left: 10px;
            visibility: visible;
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

        label[for="chkDay"] {
            font-weight: 500;
            font-size: 15px;
            font-weight: 400;
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

        input[type="submit"] {
            cursor: pointer;
        }

        input[type="radio"] {
            display: none;
        }

            input[type="radio"] + label {
                color: #555;
                padding: 9px 15px;
                width: 70px;
                display: block;
                box-sizing: border-box;
                border-radius: 10px 10px 0 0;
                background-color: #fff;
                transform: translateY(3px);
                padding-bottom: 6px;
                margin-top: 10px;
                cursor: pointer;
            }

            input[type="radio"]:checked + label {
                position: relative;
                background-color: #4582DD;
                color: #fff;
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

        #labTitle {
            font-weight: 500;
            font-size: 22px;
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

        #txtTitle {
            font-size: 14px;
            padding-left: 10px;
            width: 400px;
            margin-top: 3px;
        }

        #fpsList {
            width: 100%;
            border: 1px solid transparent;
            color: #333;
        }

            #fpsList td {
                text-align: center;
                cursor: default;
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

        .date-picker::-webkit-calendar-picker-indicator {
            pointer-events: none;
        }

        .icon_plus {
            display: inline-block;
            position: relative;
            width: 14px;
            height: 14px;
            vertical-align: middle;
        }

            .icon_plus:before {
                display: block;
                content: "가로 선입니다.";
                font-size: 0;
                width: 14px;
                height: 2px;
                background-color: #4582DD;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .icon_plus::after {
                display: block;
                content: "세로 선입니다.";
                font-size: 0;
                width: 2px;
                height: 14px;
                background-color: #4582DD;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }


        .btnPlus:hover .icon_plus::before,
        .btnPlus:hover .icon_plus::after {
            background-color: #fff;
        }

        .btnPlus:hover,
        .btnPlus:hover span,
        #cmdSearch:hover {
            background-color: #4582DD;
            color: #fff;
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
    <form id="ExpenseView" runat="server">
        <div id="b" class="wrapper">
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <table style="table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td align="center" style="width: 100%; height: 17px;">
                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                            <tr>
                                <td align="left" style="width: 50%">
                                    <asp:ImageButton ID="BtnPrint" runat="server" ImageUrl="~/DsttsBoard/Image/Print.GIF" /></td>
                                <td style="width: 50%">
                                    <asp:Label ID="LabTitle" runat="server" Font-Bold="True" Font-Size="12pt">지출 품의서 처리작업</asp:Label></td>
                            </tr>
                        </table>
                        &nbsp;
                    </td>
                </tr>
                <tr style="font-family: Times New Roman">
                    <td align="center" style="width: 100%; height: 17px">
                        <table style="font-size: 10pt; width: 100%; height: 25px">
                            <tr>
                                <td style="font-weight: bold; font-size: 9pt; width: 10%" rowspan="2" valign="middle">
                                    <asp:RadioButtonList ID="radSelect" runat="server">
                                        <asp:ListItem Selected="True" Value="0">전표</asp:ListItem>
                                        <asp:ListItem Value="1">처리</asp:ListItem>
                                    </asp:RadioButtonList></td>
                                <td align="center" style="font-weight: bold; font-size: 9pt; width: 35%" valign="middle" rowspan="2">
                                    <asp:TextBox ID="txtDate" runat="server" BorderWidth="1px" Font-Size="9pt" Style="width: 70px; text-align: center"></asp:TextBox>&nbsp;<asp:ImageButton ID="cmdCal" runat="server"
                                        ImageUrl="~/PriVate/Images/Calendar_scheduleHS.png" />
                                    부터 &nbsp; &nbsp;<asp:TextBox ID="txtDate2" runat="server" BorderWidth="1px" Font-Size="9pt"
                                        Style="width: 70px; text-align: center"></asp:TextBox>&nbsp;<asp:ImageButton ID="cmdCal2"
                                            runat="server" ImageUrl="~/PriVate/Images/Calendar_scheduleHS.png" />
                                    까지<br />
                                    <asp:CheckBox ID="chkCallDate" runat="server" Text="미입금,입금요청일 오늘 이후 기준" />
                                </td>
                                <td style="font-weight: bold; font-size: 9pt; width: 10%">제 목</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txtTitle" runat="server" BorderWidth="1px" Width="95%"></asp:TextBox></td>
                                <td rowspan="3" style="width: 10%">
                                    <asp:ImageButton ID="cmdSearch" runat="server" ImageUrl="~/images/button/btn_search.gif" /></td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold; font-size: 9pt; width: 10%">작성자</td>
                                <td style="width: 35%">
                                    <asp:TextBox ID="txtUserName" runat="server" BorderWidth="1px" Width="95%"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="width: 10%">
                                    <asp:ImageButton ID="cmdSave" runat="server" ImageUrl="~/images/button/btn_edit.gif" /></td>
                                <td align="center" style="width: 35%" valign="middle">
                                    <asp:Button ID="cmd001" runat="server" Text="전체" />
                                    <asp:Button ID="cmd002" runat="server" Text="송금" />
                                    <asp:Button ID="cmd003" runat="server" Text="현금" />
                                    <asp:Button ID="cmd004" runat="server" Text="카드" /></td>
                                <td style="width: 10%"></td>
                                <td style="width: 35%">
                                    <asp:CheckBox ID="chk1" runat="server" Font-Bold="True" Font-Size="9pt" Text="승인" />&nbsp;
                                <asp:CheckBox ID="chk2" runat="server" Font-Bold="True" Font-Size="9pt" Text="미처리" />&nbsp;
                                <asp:CheckBox ID="chk3" runat="server" Font-Bold="True" Font-Size="9pt" Text="미영수" />
                                    <asp:DropDownList ID="cmbSection" runat="server">
                                        <asp:ListItem Value="0">송금</asp:ListItem>
                                        <asp:ListItem Value="1">출금</asp:ListItem>
                                        <asp:ListItem Value="2">카드</asp:ListItem>
                                        <asp:ListItem Selected="True" Value="3">전체</asp:ListItem>
                                    </asp:DropDownList></td>
                            </tr>
                        </table>
                        &nbsp;</td>
                </tr>
                <tr style="font-family: Times New Roman">
                    <td align="right" style="width: 100%; height: 17px">
                        <asp:Button ID="cmbSave" runat="server" Text="저장" />
                    </td>
                </tr>
                <tr style="font-family: Times New Roman">
                    <td style="width: 100%">
                        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <table class="auto-style1">
                                    <tr>
                                        <td style="text-align: right;">
                                            <asp:Label ID="labTotal" runat="server" Font-Size="20pt" ForeColor="Red" Text="0"></asp:Label>
                                        </td>
                                        <td style="text-align: right;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <asp:DataGrid ID="fpsList" runat="server" AllowPaging="True" AutoGenerateColumns="False" BorderColor="#000099" BorderWidth="1px" CellPadding="4" ForeColor="#333333" PageSize="20" Style="font-size: 9pt; font-family: 돋움" Width="100%">
                                                <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                                                <EditItemStyle BackColor="#2461BF" />
                                                <SelectedItemStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                                                <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" Mode="NumericPages" />
                                                <AlternatingItemStyle BackColor="White" />
                                                <ItemStyle BackColor="#EFF3FB" Font-Size="9pt" />
                                                <HeaderStyle BackColor="#507CD1" Font-Bold="True" Font-Size="9pt" ForeColor="White" HorizontalAlign="Center" />
                                                <Columns>
                                                    <asp:TemplateColumn HeaderText="구분">
                                                        <ItemTemplate>
                                                            &nbsp;<asp:DropDownList ID="cmbList" runat="server" Font-Size="9pt">
                                                                <asp:ListItem Value="0">0:송금</asp:ListItem>
                                                                <asp:ListItem Value="1">1:출금</asp:ListItem>
                                                                <asp:ListItem Value="2">2:카드</asp:ListItem>
                                                            </asp:DropDownList>
                                                        </ItemTemplate>
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:BoundColumn HeaderText="문서번호">
                                                        <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}" HeaderText="일자">
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="username" HeaderText="작성자">
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn HeaderText="승인여부">
                                                        <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="title" FooterText="합계금액" HeaderText="제목"></asp:BoundColumn>
                                                    <asp:TemplateColumn HeaderText="처리여부">
                                                        <HeaderTemplate>
                                                            처리여부
                                                        </HeaderTemplate>
                                                        <ItemTemplate>
                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                                                <tr>
                                                                    <td align="center" style="width: 100%">
                                                                        <asp:Label ID="labExpen3" runat="server" Font-Bold="False" Font-Size="9pt" ForeColor="#0000C0"><%# DataBinder.Eval(Container.DataItem, "text1").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text2").ToString %><br /><%#DataBinder.Eval(Container.DataItem, "text7").ToString%></asp:Label>
                                                                        <asp:ImageButton ID="cmdExpen01" runat="server" CommandName="Expense01" ImageUrl="~/DsttsBoard/Image/Expen01.gif" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="width: 100%"></td>
                                                                </tr>
                                                            </table>
                                                        </ItemTemplate>
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="영수증수령">
                                                        <HeaderTemplate>
                                                            영수여부
                                                        </HeaderTemplate>
                                                        <ItemTemplate>
                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                                                <tr>
                                                                    <td align="center" style="width: 100%">
                                                                        <asp:Label ID="labExpen4" runat="server" Font-Bold="False" Font-Size="9pt" ForeColor="Navy"><%# DataBinder.Eval(Container.DataItem, "text3").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text4").ToString %><br /><%# DataBinder.Eval(Container.DataItem, "text8").ToString %></asp:Label>
                                                                        <asp:ImageButton ID="cmdExpen02" runat="server" CommandName="Expense02" ImageUrl="~/DsttsBoard/Image/Expen02.gif" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="width: 100%"></td>
                                                                </tr>
                                                            </table>
                                                        </ItemTemplate>
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:BoundColumn DataField="amount" DataFormatString="{0:n0}" HeaderText="합계금액">
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Right" />
                                                    </asp:BoundColumn>
                                                    <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                                    <asp:TemplateColumn HeaderText="입금요청일">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="labsPurcDate" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="재무요청일">
                                                        <HeaderTemplate>
                                                            재무팀요청일
                                                        </HeaderTemplate>
                                                        <ItemTemplate>
                                                            <asp:TextBox ID="txtsCallDate" runat="server" Font-Size="9pt" Height="17px" Text="" Width="80px"></asp:TextBox>
                                                        </ItemTemplate>
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" />
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="재무팀요청금액">
                                                        <ItemTemplate>
                                                            <asp:TextBox ID="txtsCallAmount" runat="server" Font-Size="9pt" Height="17px" Text="" Width="80px"></asp:TextBox>
                                                        </ItemTemplate>
                                                        <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Right" />
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="custcode" Visible="False">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="labsCustCode" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="yymm" Visible="False">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Label ID="labsYymm" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:TemplateColumn HeaderText="Update">
                                                        <EditItemTemplate>
                                                            <asp:TextBox runat="server"></asp:TextBox>
                                                        </EditItemTemplate>
                                                        <ItemTemplate>
                                                            <asp:Button ID="cmdsCall" runat="server" CommandName="nsCall" Text="Call" />
                                                            <asp:Label ID="labsUpdate" runat="server"></asp:Label>
                                                        </ItemTemplate>
                                                    </asp:TemplateColumn>
                                                    <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                                </Columns>
                                            </asp:DataGrid>
                                        </td>
                                    </tr>
                                </table>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                        <asp:DataGrid ID="fpsList2" runat="server" AutoGenerateColumns="False" BorderColor="#000099"
                            BorderWidth="1px" CellPadding="4" ForeColor="#333333" Width="100%" Style="font-size: 9pt; font-family: 돋움" Visible="False">
                            <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                            <EditItemStyle BackColor="#2461BF" />
                            <SelectedItemStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                            <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" Mode="NumericPages" />
                            <AlternatingItemStyle BackColor="White" />
                            <ItemStyle BackColor="#EFF3FB"
                                Font-Size="9pt" />
                            <HeaderStyle BackColor="#507CD1" Font-Bold="True"
                                Font-Size="9pt" ForeColor="White" HorizontalAlign="Center" />
                            <Columns>
                                <asp:TemplateColumn HeaderText="구분">
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 100%">
                                                    <asp:Label ID="labStatus" runat="server" Font-Bold="True" Font-Size="9pt"></asp:Label></td>
                                            </tr>
                                        </table>
                                        &nbsp;
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:BoundColumn HeaderText="문서번호">
                                    <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn HeaderText="일자" DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}">
                                    <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn HeaderText="작성자" DataField="username">
                                    <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn HeaderText="승인여부">
                                    <ItemStyle Font-Bold="True" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Center" />
                                </asp:BoundColumn>
                                <asp:BoundColumn FooterText="합계금액" HeaderText="제목" DataField="title"></asp:BoundColumn>
                                <asp:TemplateColumn HeaderText="처리여부">
                                    <HeaderTemplate>
                                        처리여부
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 100%">
                                                    <asp:Label ID="labExpen01" runat="server" Font-Bold="False" Font-Size="9pt" ForeColor="#0000C0"><%# DataBinder.Eval(Container.DataItem, "text1").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text2").ToString %></asp:Label>
                                                </td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:TemplateColumn HeaderText="영수증수령">
                                    <HeaderTemplate>
                                        영수여부
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td align="center" style="width: 100%">
                                                    <asp:Label ID="labExpen02" runat="server" Font-Bold="False" Font-Size="9pt" ForeColor="Navy"><%# DataBinder.Eval(Container.DataItem, "text3").ToString %> : <%# DataBinder.Eval(Container.DataItem, "text4").ToString %></asp:Label></td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                    <EditItemTemplate>
                                        <asp:TextBox runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                </asp:TemplateColumn>
                                <asp:BoundColumn HeaderText="합계금액" DataField="amount" DataFormatString="{0:n0}">
                                    <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                        Font-Underline="False" HorizontalAlign="Right" />
                                </asp:BoundColumn>
                                <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                            </Columns>
                        </asp:DataGrid>
                        <br />
                        <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False"
                            EnableModelValidation="True" Visible="False">
                            <Columns>
                                <asp:TemplateField HeaderText="구분">
                                    <EditItemTemplate>
                                        <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <asp:Label ID="labStatus" runat="server" Font-Bold="True" Font-Size="9pt"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField HeaderText="문서번호" />
                                <asp:BoundField DataField="entrydate" DataFormatString="{0:yyyy-MM-dd}"
                                    HeaderText="일자" />
                                <asp:BoundField DataField="username" HeaderText="작성자" />
                                <asp:BoundField HeaderText="승인여부" />
                                <asp:BoundField DataField="title" HeaderText="제목" />
                                <asp:TemplateField HeaderText="처리여부">
                                    <EditItemTemplate>
                                        <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <asp:Label ID="labExpen01" runat="server" Font-Bold="False" Font-Size="9pt"
                                            ForeColor="#0000C0"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField HeaderText="영수여부">
                                    <EditItemTemplate>
                                        <asp:TextBox ID="TextBox3" runat="server"></asp:TextBox>
                                    </EditItemTemplate>
                                    <ItemTemplate>
                                        <asp:Label ID="labExpen02" runat="server" Font-Bold="False" Font-Size="9pt"
                                            ForeColor="Navy"></asp:Label>
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField HeaderText="합계금액" DataField="amount"
                                    DataFormatString="{0:n0}" />
                            </Columns>
                        </asp:GridView>
                    </td>
                </tr>
                <tr style="font-family: Times New Roman">
                    <td align="right" style="width: 100%"></td>
                </tr>
                <tr style="font-family: Times New Roman">
                    <td align="center" style="width: 100%">&nbsp; &nbsp;</td>
                </tr>
            </table>


            <ajaxToolkit:CalendarExtender ID="calendarButtonExtender" runat="server" Format="yyyy-MM-dd"
                PopupButtonID="cmdCal" TargetControlID="txtDate"></ajaxToolkit:CalendarExtender>
            <ajaxToolkit:CalendarExtender ID="calendarButtonExtender2" runat="server" Format="yyyy-MM-dd"
                PopupButtonID="cmdCal2" TargetControlID="txtDate2"></ajaxToolkit:CalendarExtender>
        </div>
    </form>
</body>
</html>
